from bs4 import BeautifulSoup
import logging
import xml.etree.ElementTree as ET
import uuid
import os
import re

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def truncate_text(text, max_length=100):
    """Truncate text to max_length, preserving whole words."""
    if len(text) <= max_length:
        return text
    truncated = text[:max_length].rsplit(' ', 1)[0]
    return truncated.rstrip('.') + '...' if truncated else text[:max_length]

def scrape_zap_report(report_path, scan_type_full="zap_regular", include_all_severities=False):
    """Parse a ZAP HTML report for dashboard-friendly output."""
    try:
        # Read the report file
        with open(report_path, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f, 'lxml')  # Use lxml for faster parsing

        # Initialize output structure
        result = {
            "scan_type_full": scan_type_full,
            "summary": {
                "high": 0,
                "medium": 0,
                "low": 0,
                "informational": 0,
                "false_positives": 0
            },
            "vulnerabilities": [],
            "total_vulnerabilities": 0
        }

        # Parse summary
        summary_table = soup.find('table', class_='summary')
        if summary_table:
            for row in summary_table.find_all('tr')[1:]:  # Skip header row
                cells = row.find_all('td')
                if len(cells) >= 2:
                    risk_level = cells[0].get_text(strip=True).lower().replace(' ', '_')
                    count = int(cells[1].get_text(strip=True) or 0)
                    if risk_level in result["summary"]:
                        result["summary"][risk_level] = count
                    else:
                        logger.warning(f"Unknown risk level in summary: {risk_level}")

        # Parse alerts
        alerts_table = soup.find('table', class_='alerts')
        if not alerts_table:
            logger.error("No alerts table found in ZAP report")
            return result

        alert_links = [a['href'][1:] for a in alerts_table.select('a[href]')]

        # Deduplicate alerts by alert_id
        seen_alerts = {}
        for alert_id in alert_links:
            alert_section = soup.find('a', id=alert_id)
            if not alert_section:
                logger.warning(f"Alert section not found for ID: {alert_id}")
                continue

            table = alert_section.find_parent('table')
            if not table:
                logger.warning(f"No table found for alert ID: {alert_id}")
                continue

            # Extract alert details
            headers = table.find_all('th')
            if len(headers) < 2:
                logger.warning(f"Invalid table structure for alert ID: {alert_id}")
                continue

            name = headers[1].text.strip()
            risk_level = headers[0].text.strip().lower()
            severity = risk_level.capitalize()

            # Filter severities unless include_all_severities is True
            if not include_all_severities and risk_level not in ['high', 'medium']:
                continue

            instances_tag = table.find('td', string='Instances')
            instance_count = int(instances_tag.find_next_sibling('td').text.strip()) if instances_tag else 1

            description_tag = table.find('td', string='Description')
            description = description_tag.find_next_sibling('td').get_text(strip=True) if description_tag else ""
            description = truncate_text(description)

            solution_tag = table.find('td', string='Solution')
            solution = solution_tag.find_next_sibling('td').get_text(strip=True) if solution_tag else ""
            solution = truncate_text(solution) or "Review server configuration."

            # Extract one representative instance
            example_instance = {}
            instance_rows = table.find_all('tr', class_='indent1')
            if instance_rows:
                for row in instance_rows:
                    url_tag = row.find('td', string='URL')
                    if url_tag:
                        example_instance['url'] = url_tag.find_next_sibling('td').text.strip()
                        for sibling in row.find_next_siblings('tr'):
                            if 'indent1' in sibling.td.get('class', []):
                                break
                            key = sibling.find('td', class_='indent2')
                            if key and key.text.strip() == 'Method':
                                example_instance['method'] = sibling.find('td', class_=None).text.strip()
                                break
                        break
            else:
                logger.debug(f"No instance details found for alert: {name}")

            # Create vulnerability entry
            vulnerability = {
                "name": name,
                "severity": severity,
                "description": description,
                "solution": solution,
                "instance_count": instance_count,
                "example_instance": example_instance
            }

            # Deduplicate by name and severity
            alert_key = f"{name}_{severity}"
            if alert_key in seen_alerts:
                seen_alerts[alert_key]["instance_count"] += instance_count
                logger.debug(f"Merged duplicate alert: {name} ({severity})")
            else:
                seen_alerts[alert_key] = vulnerability
                result["vulnerabilities"].append(vulnerability)

        # Calculate total vulnerabilities
        result["total_vulnerabilities"] = len(result["vulnerabilities"])

        logger.info(f"Scraped {result['total_vulnerabilities']} vulnerabilities from {report_path}")
        return result

    except Exception as e:
        logger.error(f"Error parsing ZAP report {report_path}: {str(e)}")
        return {
            "scan_type_full": scan_type_full,
            "summary": {"high": 0, "medium": 0, "low": 0, "informational": 0, "false_positives": 0},
            "vulnerabilities": [],
            "total_vulnerabilities": 0,
            "error": f"Failed to scrape report: {str(e)}"
        }

def scrape_nmap_report(report_path, scan_type_full="nmap_regular"):
    """Parse an Nmap XML report for dashboard-friendly output."""
    try:
        # Parse the XML file
        tree = ET.parse(report_path)
        root = tree.getroot()

        # Initialize output structure
        result = {
            "scan_type_full": scan_type_full,
            "metadata": {
                "scanner": root.get("scanner", "nmap"),
                "version": root.get("version", ""),
                "start_time": root.get("startstr", ""),
                "args": root.get("args", ""),
                "scan_type": root.find("scaninfo").get("type", "") if root.find("scaninfo") is not None else ""
            },
            "summary": {
                "open_ports": 0,
                "filtered_ports": 0,
                "total_scanned_ports": 0,
                "hosts_up": 0,
                "hosts_down": 0
            },
            "hosts": [],
            "total_hosts": 0
        }

        # Parse summary
        scaninfo = root.find("scaninfo")
        if scaninfo is not None:
            result["summary"]["total_scanned_ports"] = int(scaninfo.get("numservices", 0))

        extraports = root.find(".//extraports")
        if extraports is not None:
            if extraports.get("state") == "filtered":
                result["summary"]["filtered_ports"] = int(extraports.get("count", 0))

        runstats = root.find("runstats/hosts")
        if runstats is not None:
            result["summary"]["hosts_up"] = int(runstats.get("up", 0))
            result["summary"]["hosts_down"] = int(runstats.get("down", 0))
            result["total_hosts"] = int(runstats.get("total", 0))

        # Parse hosts
        for host in root.findall("host"):
            host_data = {
                "ip_address": "",
                "hostnames": [],
                "status": "",
                "reason": "",
                "round_trip_time": 0,
                "open_ports": [],
                "vulnerabilities": []
            }

            # IP address
            address = host.find("address")
            if address is not None:
                host_data["ip_address"] = address.get("addr", "")

            # Hostnames
            hostnames = host.find("hostnames")
            if hostnames is not None:
                for hostname in hostnames.findall("hostname"):
                    host_data["hostnames"].append({
                        "name": hostname.get("name", ""),
                        "type": hostname.get("type", "")
                    })

            # Status
            status = host.find("status")
            if status is not None:
                host_data["status"] = status.get("state", "")
                host_data["reason"] = status.get("reason", "")

            # Round trip time
            times = host.find("times")
            if times is not None:
                srtt = times.get("srtt")
                host_data["round_trip_time"] = int(srtt) / 1000 if srtt and srtt.isdigit() else 0  # Convert microseconds to milliseconds

            # Ports
            ports = host.find("ports")
            if ports is not None:
                for port in ports.findall("port"):
                    if port.find("state").get("state") != "open":
                        continue

                    port_data = {
                        "portid": port.get("portid", ""),
                        "protocol": port.get("protocol", ""),
                        "service": {
                            "name": "",
                            "product": "",
                            "version": "",
                            "extrainfo": ""
                        }
                    }

                    # Service details
                    service = port.find("service")
                    if service is not None:
                        port_data["service"]["name"] = service.get("name", "")
                        port_data["service"]["product"] = service.get("product", "")
                        port_data["service"]["version"] = service.get("version", "")
                        port_data["service"]["extrainfo"] = service.get("extrainfo", "")

                    host_data["open_ports"].append(port_data)
                    result["summary"]["open_ports"] += 1

                    # Vulnerabilities (CVSS >= 6)
                    for script in port.findall("script[@id='vulners']"):
                        for table in script.findall("table"):
                            cvss = table.find("elem[@key='cvss']")
                            if cvss is None or not cvss.text:
                                continue
                            cvss_score = float(cvss.text)
                            if cvss_score < 6:
                                continue

                            vuln_id = table.find("elem[@key='id']").text if table.find("elem[@key='id']") is not None else ""
                            vuln_type = table.find("elem[@key='type']").text if table.find("elem[@key='type']") is not None else ""
                            is_exploit = table.find("elem[@key='is_exploit']").text.lower() == "true" if table.find("elem[@key='is_exploit']") is not None else False

                            vulnerability = {
                                "portid": port.get("portid", ""),
                                "cvss_score": cvss_score,
                                "id": vuln_id,
                                "type": vuln_type,
                                "is_exploit": is_exploit
                            }
                            host_data["vulnerabilities"].append(vulnerability)

            result["hosts"].append(host_data)

        logger.info(f"Scraped {result['total_hosts']} hosts from {report_path}")
        return result

    except ET.ParseError as e:
        logger.error(f"Error parsing Nmap XML report {report_path}: {str(e)}")
        return {
            "scan_type_full": scan_type_full,
            "metadata": {},
            "summary": {"open_ports": 0, "filtered_ports": 0, "total_scanned_ports": 0, "hosts_up": 0, "hosts_down": 0},
            "hosts": [],
            "total_hosts": 0,
            "error": f"Failed to parse XML report: {str(e)}"
        }
    except Exception as e:
        logger.error(f"Error processing Nmap report {report_path}: {str(e)}")
        return {
            "scan_type_full": scan_type_full,
            "metadata": {},
            "summary": {"open_ports": 0, "filtered_ports": 0, "total_scanned_ports": 0, "hosts_up": 0, "hosts_down": 0},
            "hosts": [],
            "total_hosts": 0,
            "error": f"Failed to process report: {str(e)}"
        }

def scrape_nmap_deep_report(report_path, scan_type_full="nmap_deep"):
    """Parse an Nmap deep report using regex to extract host, ports, and vulnerabilities."""
    # Default result structure
    result = {
        "scan_type_full": scan_type_full,
        "metadata": {
            "scanner": "nmap",
            "version": "",
            "start_time": "",
            "args": "",
            "scan_type": ""
        },
        "summary": {
            "open_ports": 0,
            "filtered_ports": 0,
            "total_scanned_ports": 0,
            "hosts_up": 0,
            "hosts_down": 0
        },
        "hosts": []
    }

    # Check if file exists
    if not os.path.exists(report_path):
        logger.error(f"Report file not found: {report_path}")
        return result

    try:
        # Read the file
        with open(report_path, 'r', encoding='utf-8') as file:
            content = file.read()

        # Initialize host data
        host_data = {
            "ip_address": "",
            "hostnames": [],
            "status": "",
            "reason": "",
            "round_trip_time": 0,
            "open_ports": []
        }

        # Extract IP address
        ip_match = re.search(r'<address>(.*?)</address>', content)
        if ip_match:
            host_data["ip_address"] = ip_match.group(1)
            logger.debug(f"Found IP: {host_data['ip_address']}")

        # Extract hostname
        hostname_match = re.search(r'<hostname>(.*?)</hostname>', content)
        if hostname_match and hostname_match.group(1):
            host_data["hostnames"].append({"name": hostname_match.group(1), "type": "user"})
            logger.debug(f"Found hostname: {host_data['hostnames']}")

        # Infer status from OS
        os_match = re.search(r'<os>(.*?)</os>', content)
        if os_match:
            host_data["status"] = "up"
            host_data["reason"] = "OS detected"
            result["summary"]["hosts_up"] = 1
            logger.debug("Host status set to 'up'")

        # Extract ports
        ports_match = re.finditer(r'<port number="(\d+)" state="(\w+)">(.*?)</port>', content, re.DOTALL)
        for port_match in ports_match:
            port_number = port_match.group(1)
            port_state = port_match.group(2)
            port_content = port_match.group(3)

            if port_state != "open":
                continue

            port_data = {
                "portid": port_number,
                "protocol": "tcp",
                "service": {
                    "name": "",
                    "version": "",
                },
                "vulnerabilities": []
            }

            # Extract service details
            service_match = re.search(r'<service name="([^"]+)" version="([^"]*)"', port_content)
            if service_match:
                port_data["service"]["name"] = service_match.group(1)
                port_data["service"]["version"] = service_match.group(2)
                logger.debug(f"Port {port_number} service: {port_data['service']}")

            # Extract vulnerabilities
            vuln_sections = re.findall(r'<vulnerabilities>(.*?)</vulnerabilities>', port_content, re.DOTALL)
            seen_vulns = set()  # For deduplication
            for vuln_section in vuln_sections:
                vuln_matches = re.finditer(
                    r'<vulnerability>\s*<id>(.*?)</id>\s*<cvss_score>(.*?)</cvss_score>\s*<exploit_url>(.*?)</exploit_url>\s*</vulnerability>',
                    vuln_section, re.DOTALL
                )
                for vuln_match in vuln_matches:
                    vuln_id = vuln_match.group(1)
                    if vuln_id in seen_vulns:
                        continue
                    seen_vulns.add(vuln_id)

                    cvss_score = float(vuln_match.group(2)) if vuln_match.group(2).strip() else 0.0
                    if cvss_score >= 8:
                        vulnerability = {
                            "vulners_id": vuln_id,
                            "cvss_score": cvss_score,
                            "exploit_url": vuln_match.group(3)
                        }
                        # Remove empty fields
                        vulnerability = {k: v for k, v in vulnerability.items() if v}
                        port_data["vulnerabilities"].append(vulnerability)
                        logger.debug(f"Port {port_number} vulnerability added: {vuln_id}")

            host_data["open_ports"].append(port_data)
            result["summary"]["open_ports"] += 1
            logger.debug(f"Processed open port {port_number}")

        # Add host to result if we have data
        if host_data["ip_address"] or host_data["hostnames"]:
            result["hosts"].append(host_data)
            logger.debug("Host added to result")

        logger.info(f"Successfully parsed report: {report_path}")
        return result

    except Exception as e:
        logger.error(f"Error parsing report {report_path}: {str(e)}")
        return result  # Always return the default structure

def process_scan_response(scan_response):
    """Process the scan response and scrape the report for dashboard display."""
    result = {
        "report_id": scan_response.get("report_id", ""),
        "report_path": scan_response.get("report_path", ""),
        "scan_type": scan_response.get("scan_type", ""),
        "scan_type_full": scan_response.get("scan_type_full", ""),
        "is_deep": False
    }
    try:
        report_id = scan_response.get("report_id")
        report_path = scan_response.get("report_path")
        scan_type = scan_response.get("scan_type")
        scan_type_full = scan_response.get("scan_type_full", scan_type)

        if not os.path.exists(report_path):
            logger.error(f"Report file not found: {report_path}")
            result["error"] = f"Report file not found: {report_path}"
            return result

        result["is_deep"] = "deep" in scan_type_full.lower()

        if "zap" in scan_type.lower():
            zap_result = scrape_zap_report(
                report_path,
                scan_type_full=scan_type_full,
                include_all_severities=result["is_deep"]
            )
            result.update({
                "summary": zap_result["summary"],
                "vulnerabilities": zap_result["vulnerabilities"],
                "total_vulnerabilities": zap_result["total_vulnerabilities"]
            })
            if "error" in zap_result:
                result["error"] = zap_result["error"]
        elif "nmap" in scan_type.lower():
            if result["is_deep"]:
                nmap_result = scrape_nmap_deep_report(report_path, scan_type_full=scan_type_full)
            else:
                nmap_result = scrape_nmap_report(report_path, scan_type_full=scan_type_full)
            result.update({
                "metadata": nmap_result.get("metadata", {}),
                "summary": nmap_result.get("summary", {"open_ports": 0, "filtered_ports": 0, "total_scanned_ports": 0, "hosts_up": 0, "hosts_down": 0}),
                "hosts": nmap_result.get("hosts", []),
                "total_hosts": nmap_result.get("total_hosts", 0) if not result["is_deep"] else len(nmap_result.get("hosts", []))
            })
            if "error" in nmap_result:
                result["error"] = nmap_result["error"]

        return result

    except Exception as e:
        logger.error(f"Error processing scan response: {str(e)}")
        result["error"] = f"Error processing scan response: {str(e)}"
        return result