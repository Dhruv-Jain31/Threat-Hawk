import subprocess
import os
import time
from urllib.parse import urlparse
import re
import requests
import uuid
from datetime import datetime
import xml.etree.ElementTree as ET
import xml.dom.minidom as minidom 

# Mock mode for testing (set to False for real scans)
MOCK_MODE = False
MOCK_REPORTS_DIR = "mock_reports"

# Valid scan types
VALID_SCAN_TYPES = ['nmap_regular', 'nmap_deep', 'zap_regular', 'zap_deep']

def is_valid_url(url):
    """Validate URL format"""
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except ValueError:
        return False

def extract_host(url):
    """Extract hostname from URL"""
    parsed = urlparse(url)
    hostname = parsed.hostname or url
    # Basic IP validation
    if re.match(r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$', hostname):
        return hostname
    # Ensure hostname is not a private IP
    private_ip_patterns = [r'^10\.', r'^172\.(1[6-9]|2[0-9]|3[0-1])\.', r'^192\.168\.', r'^127\.']
    if any(re.match(pattern, hostname) for pattern in private_ip_patterns):
        raise ValueError("Scanning private or reserved IP ranges is not allowed")
    return hostname

def start_zap_container(report_dir):
    """Start a ZAP container and return the container ID and host port (placeholder for CLI approach)"""
    return str(uuid.uuid4()), 0, f"zap_scan_{uuid.uuid4().hex[:8]}"

def stop_zap_container(container_id):
    """Stop and remove the ZAP container (no-op for CLI approach)"""
    pass

def check_zap_api(zap_port):
    """Check if ZAP API is accessible with retries (not used for CLI)"""
    return True

def parse_nmap_txt_to_xml(txt_output, target_hostname):
    """Convert Nmap .txt output to XML format and pretty-print it"""
    root = ET.Element("nmap_scan")
    host = ET.SubElement(root, "host")
    
    # Extract target IP and hostname
    ip_match = re.search(r"Nmap scan report for (.+) \(([\d\.]+)\)", txt_output)
    if ip_match:
        hostname = ip_match.group(1)
        ip_address = ip_match.group(2)
    else:
        hostname = target_hostname
        ip_address = extract_host(target_hostname)

    ET.SubElement(host, "address").text = ip_address
    ET.SubElement(host, "hostname").text = hostname

    # Extract OS
    os_match = re.search(r"OS: ([^\n;]+)", txt_output)
    if os_match:
        ET.SubElement(host, "os").text = os_match.group(1)

    # Extract ports and services
    ports_section = re.search(r"PORT\s+STATE\s+SERVICE\s+VERSION\n([\s\S]+?)\n\n", txt_output, re.MULTILINE)
    ports_elem = ET.SubElement(host, "ports")

    current_port = None
    vulnerabilities = None
    if ports_section:
        lines = ports_section.group(1).splitlines()
        for line in lines:
            line = line.strip()
            if not line:
                continue
            # Match port line (e.g., "22/tcp  open  ssh      OpenSSH 9.6p1 Ubuntu 3ubuntu13.5 (Ubuntu Linux; protocol 2.0)")
            port_match = re.match(r"(\d+)/tcp\s+(\w+)\s+(\S+)\s*(.*)", line)
            if port_match:
                if current_port and vulnerabilities:
                    current_port.append(vulnerabilities)
                port_number, state, service, version = port_match.groups()
                current_port = ET.SubElement(ports_elem, "port")
                current_port.set("number", port_number)
                current_port.set("state", state)
                service_elem = ET.SubElement(current_port, "service")
                service_elem.set("name", service)
                if version:
                    service_elem.set("version", version.strip())
                vulnerabilities = None
            # Match vulners script output (e.g., "| vulners: ...")
            elif line.startswith("| vulners:"):
                vulnerabilities = ET.SubElement(current_port, "vulnerabilities")
            # Match vulnerability lines (e.g., "|      CVE-2024-6387  8.1  https://vulners.com/cve/CVE-2024-6387")
            elif line.startswith("|") and ("CVE-" in line or "*EXPLOIT*" in line):
                vuln_match = re.match(r"\|.*?(CVE-\d{4}-\d{4,7}|\S+)\s+([\d\.]+)\s+(https?://\S+)", line)
                if vuln_match:
                    vuln_id, cvss_score, exploit_url = vuln_match.groups()
                    vuln = ET.SubElement(vulnerabilities, "vulnerability")
                    ET.SubElement(vuln, "id").text = vuln_id
                    ET.SubElement(vuln, "cvss_score").text = cvss_score
                    ET.SubElement(vuln, "exploit_url").text = exploit_url
        # Append vulnerabilities to the last port
        if current_port and vulnerabilities:
            current_port.append(vulnerabilities)

    # Convert the XML tree to a string
    xml_string = ET.tostring(root, encoding='unicode')

    # Pretty-print the XML
    dom = minidom.parseString(xml_string)
    pretty_xml = dom.toprettyxml(indent="  ")

    return pretty_xml

def run_nmap_scan(url, scan_type):
    """Run Nmap scan using instrumentisto/nmap Docker image"""
    if MOCK_MODE:
        mock_path = os.path.join(MOCK_REPORTS_DIR, 'nmap_report.xml' if scan_type == 'nmap_regular' else 'nmap_report.txt')
        if not os.path.exists(mock_path):
            raise FileNotFoundError(f"Mock report not found: {mock_path}")
        with open(mock_path, 'r') as f:
            content = f.read()
            return content if scan_type == 'nmap_regular' else parse_nmap_txt_to_xml(content, url)

    target = extract_host(url)
    temp_dir = os.path.abspath("temp_nmap")
    os.makedirs(temp_dir, exist_ok=True)
    temp_output_file = os.path.join(temp_dir, "nmap_output.txt")

    cmd = [
        'docker', 'run', '--rm',
        '-v', f"{temp_dir}:/host",  # Changed to /host to match manual command
        'instrumentisto/nmap'
    ]
    if scan_type == 'nmap_deep':
        cmd.extend(['-sT', '-sV', '--script', 'vulners', '-oN', '/host/nmap_output.txt'])
        print(f"Running nmap_deep with target: {target} and command: {' '.join(cmd + [target])}")
    else:  # nmap_regular
        cmd.extend(['-A', '-oX', '-'])
        print(f"Running nmap_regular with target: {target} and command: {' '.join(cmd)}")
    cmd.append(target)

    try:
        process = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=300
        )
        if process.returncode != 0:
            raise Exception(f"Nmap scan failed with exit code {process.returncode}: {process.stderr}")

        if scan_type == 'nmap_regular':
            return process.stdout  # Return XML directly for nmap_regular
        else:  # nmap_deep
            # Read the normal output from the temporary file
            output = ""
            if os.path.exists(temp_output_file):
                with open(temp_output_file, 'r', encoding='utf-8') as f:
                    output = f.read()
                os.remove(temp_output_file)
            else:
                print("Warning: Normal output file not found.")
                output = process.stdout

            # Debug: Check if vulners script ran for deep scan
            if scan_type == 'nmap_deep':
                if 'vulners' not in output.lower():
                    print("Warning: vulners script may not have executed or returned data.")
                else:
                    print("vulners script executed successfully.")

            # Convert to XML
            xml_output = parse_nmap_txt_to_xml(output, url)
            return xml_output
    except subprocess.TimeoutExpired:
        raise Exception("Nmap scan timed out after 5 minutes.")
    except subprocess.CalledProcessError as e:
        raise Exception(f"Nmap scan failed: {e.output}")
    finally:
        if os.path.exists(temp_dir) and not os.listdir(temp_dir):
            os.rmdir(temp_dir)

'''
def run_nmap_scan(url, scan_type):
    """Run Nmap scan using instrumentisto/nmap Docker image"""
    if MOCK_MODE:
        mock_path = os.path.join(MOCK_REPORTS_DIR, 'nmap_report.xml')
        if not os.path.exists(mock_path):
            raise FileNotFoundError(f"Mock report not found: {mock_path}")
        with open(mock_path, 'r') as f:
            return f.read()

    target = extract_host(url)
    cmd = ['docker', 'run', '--rm', 'instrumentisto/nmap']
    if scan_type == 'nmap_deep':
        cmd.extend(['-sT', '-sV', '--script', 'vulners', '-oX', '-'])
    else:
        cmd.extend(['-A', '-oX', '-'])
    cmd.append(target)

    try:
        process = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=300
        )
        return process.stdout
    except subprocess.TimeoutExpired:
        raise Exception("Nmap scan timed out after 5 minutes.")
    except subprocess.CalledProcessError as e:
        raise Exception(f"Nmap scan failed: {e.output}")
'''

def run_zap_scan(url, scan_type, report_dir, report_filename):
    """Run ZAP scan using zap-baseline.py or zap-full-scan.py"""
    print(f"Starting ZAP scan for {url} with type {scan_type}")
    if MOCK_MODE:
        mock_path = os.path.join(MOCK_REPORTS_DIR, 'zap_report.html')
        if not os.path.exists(mock_path):
            raise FileNotFoundError(f"Mock report not found: {mock_path}")
        with open(mock_path, 'r') as f:
            return f.read()

    if not is_valid_url(url):
        raise ValueError("Invalid URL format")

    # Ensure report directory exists and is writable
    os.makedirs(report_dir, exist_ok=True)
    report_path = os.path.join(report_dir, report_filename)

    # Determine the ZAP script based on scan_type and set timeout
    if scan_type == "zap_regular":
        zap_script = "zap-baseline.py"
        timeout_seconds = 1200  # 20 minutes for baseline scan
    elif scan_type == "zap_deep":
        zap_script = "zap-full-scan.py"
        timeout_seconds = 3600  # 60 minutes for deep scan
    else:
        raise ValueError(f"Unsupported scan_type: {scan_type}. Use 'zap_regular' or 'zap_deep'.")

    # Construct the Docker command with the provided report filename
    cmd = [
        "docker", "run",
        "--rm",
        "--network=host",
        "-v", f"{os.path.abspath(report_dir).replace('\\', '/')}:/zap/wrk:rw",
        "ghcr.io/zaproxy/zaproxy:stable",
        zap_script,
        "-t", url,
        "-r", f"{report_filename}"  # Use the provided filename directly
    ]

    print(f"Running ZAP command: {' '.join(cmd)}")
    try:
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        start_time = time.time()
        stdout, stderr = "", ""
        while True:
            elapsed_time = time.time() - start_time
            if elapsed_time > timeout_seconds:
                process.terminate()
                raise subprocess.TimeoutExpired(cmd, timeout_seconds, f"Scan timed out after {timeout_seconds} seconds")
            
            stdout_line = process.stdout.readline()
            stderr_line = process.stderr.readline()
            if stdout_line:
                print(f"ZAP scan progress: {stdout_line.strip()}")
                stdout += stdout_line
            if stderr_line:
                print(f"ZAP scan warning/error: {stderr_line.strip()}")
                stderr += stderr_line
            
            if process.poll() is not None:
                remaining_stdout, remaining_stderr = process.communicate()
                stdout += remaining_stdout
                stderr += remaining_stderr
                break

        if process.returncode != 0 and process.returncode != 2:
            error_msg = f"Docker command failed with exit code {process.returncode}"
            if stderr:
                error_msg += f": {stderr}"
            elif stdout:
                error_msg += f": {stdout}"
            else:
                error_msg += ": No detailed error output"
            raise Exception(error_msg)

        print(f"ZAP scan completed. Full stdout: {stdout}")
        if stderr:
            print(f"ZAP scan stderr: {stderr}")

    except subprocess.TimeoutExpired as e:
        print(f"ZAP scan error: {str(e)}")
        raise Exception(f"ZAP scan failed: {str(e)}")
    except Exception as e:
        print(f"ZAP scan error: {str(e)}")
        raise Exception(f"ZAP scan failed: {str(e)}")

    # Read the generated report
    max_wait_time = 120  # 2 minutes for file to appear
    wait_time = 0
    while not os.path.exists(report_path) and wait_time < max_wait_time:
        time.sleep(5)
        wait_time += 5
        print(f"Waiting for report at {report_path}... ({wait_time}s elapsed)")

    if not os.path.exists(report_path):
        raise Exception(f"Report file not found at {report_path} after {max_wait_time} seconds")
    with open(report_path, 'r', encoding='utf-8') as f:
        report = f.read()
    if not report or '<html' not in report.lower():
        raise Exception("ZAP report is empty or invalid")
    print(f"Report generated successfully at {report_path}")
    return report

def run_scan(url, scan_type, report_dir=None, report_filename=None):
    """Run the specified scan type"""
    if scan_type not in VALID_SCAN_TYPES:
        raise ValueError(f"Invalid scan type: {scan_type}. Supported types: {', '.join(VALID_SCAN_TYPES)}")
    
    if not url:
        raise ValueError("URL cannot be empty")

    if scan_type in ['nmap_regular', 'nmap_deep']:
        return run_nmap_scan(url, scan_type)
    elif scan_type in ['zap_regular', 'zap_deep']:
        if not report_dir or not report_filename:
            raise ValueError("report_dir and report_filename are required for ZAP scans")
        return run_zap_scan(url, scan_type, report_dir, report_filename)