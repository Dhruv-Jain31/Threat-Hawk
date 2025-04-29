from bs4 import BeautifulSoup
import logging
import xml.etree.ElementTree as ET
import uuid
import os

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

def process_scan_response(scan_response):
    """Process the scan response and scrape the report for dashboard display."""
    try:
        report_id = scan_response.get("report_id")
        report_path = scan_response.get("report_path")
        scan_type = scan_response.get("scan_type")
        scan_type_full = scan_response.get("scan_type_full", scan_type)

        if not os.path.exists(report_path):
            logger.error(f"Report file not found: {report_path}")
            return {"error": f"Report file not found: {report_path}"}

        result = {
            "report_id": report_id,
            "report_path": report_path,
            "scan_type": scan_type,
            "scan_type_full": scan_type_full,
            "is_deep": "deep" in scan_type_full.lower()
        }

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
            nmap_result = scrape_nmap_report(report_path, scan_type_full=scan_type_full)
            result.update({
                "metadata": nmap_result["metadata"],
                "summary": nmap_result["summary"],
                "hosts": nmap_result["hosts"],
                "total_hosts": nmap_result["total_hosts"]
            })
            if "error" in nmap_result:
                result["error"] = nmap_result["error"]
        else:
            logger.error(f"Unsupported scan type: {scan_type}")
            return {"error": f"Unsupported scan type: {scan_type}"}

        return result

    except Exception as e:
        logger.error(f"Error processing scan response: {str(e)}")
        return {"error": f"Error processing scan response: {str(e)}"}