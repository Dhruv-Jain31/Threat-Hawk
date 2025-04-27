import subprocess
from zapv2 import ZAPv2
import os
import time
from urllib.parse import urlparse
import re
import requests
import uuid

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
    """Start a ZAP container and return the container ID and host port"""
    zap_port = 8090  # Fixed port for now; consider dynamic port allocation for concurrency
    container_name = f"zap_scan_{uuid.uuid4().hex[:8]}"
    
    # Ensure report_dir is absolute and normalized for Docker volume mounting on Windows
    report_dir = os.path.abspath(report_dir).replace('\\', '/')
    
    cmd = [
        'docker', 'run', '-d',
        '-p', f'{zap_port}:8080',
        '-v', f'{report_dir}:/zap/wrk:rw',
        '--name', container_name,
        'ghcr.io/zaproxy/zaproxy:stable',
        'zap.sh', '-daemon', '-host', '0.0.0.0', '-port', '8080'
    ]
    
    try:
        container_id = subprocess.check_output(cmd, text=True).strip()
        return container_id, zap_port, container_name
    except subprocess.CalledProcessError as e:
        raise Exception(f"Failed to start ZAP container: {e.output}")

def stop_zap_container(container_id):
    """Stop and remove the ZAP container"""
    try:
        subprocess.run(['docker', 'stop', container_id], capture_output=True, text=True, check=True)
        subprocess.run(['docker', 'rm', container_id], capture_output=True, text=True, check=True)
    except subprocess.CalledProcessError as e:
        raise Exception(f"Failed to stop/remove ZAP container: {e.output}")

def check_zap_api(zap_port):
    """Check if ZAP API is accessible with retries"""
    max_retries = 100  # Increased retries due to ZAP startup time
    retry_delay = 10  # seconds
    for attempt in range(max_retries):
        try:
            response = requests.get(f'http://127.0.0.1:{zap_port}', timeout=5)
            if response.status_code == 200:
                return True
        except requests.RequestException:
            if attempt == max_retries - 1:
                raise Exception(f"ZAP API is not accessible at http://localhost:{zap_port} after {max_retries * retry_delay} seconds.")
            time.sleep(retry_delay)
    return False

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
        cmd.extend(['-A', '--script', 'vulners', '-oX', '-'])
    else:
        cmd.extend(['-A', '-oX', '-'])
    cmd.append(target)

    try:
        process = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=300  # 5-minute timeout
        )
        return process.stdout
    except subprocess.TimeoutExpired:
        raise Exception("Nmap scan timed out after 5 minutes.")
    except subprocess.CalledProcessError as e:
        raise Exception(f"Nmap scan failed: {e.output}")

def run_zap_scan(url, scan_type, report_dir):
    print(f"Starting ZAP scan for {url} with type {scan_type}")
    if MOCK_MODE:
        mock_path = os.path.join(MOCK_REPORTS_DIR, 'zap_report.html')
        if not os.path.exists(mock_path):
            raise FileNotFoundError(f"Mock report not found: {mock_path}")
        with open(mock_path, 'r') as f:
            return f.read()

    if not is_valid_url(url):
        raise ValueError("Invalid URL format")

    container_id, zap_port, container_name = start_zap_container(report_dir)
    print(f"Container started: {container_id}, port: {zap_port}")
    
    try:
        print(f"Checking ZAP API on port {zap_port}")
        if not check_zap_api(zap_port):
            raise Exception(f"Failed to connect to ZAP API at http://127.0.0.1:{zap_port} after retries.")
        print(f"ZAP API connected on port {zap_port}")

        zap = ZAPv2(proxies={'http': f'http://127.0.0.1:{zap_port}', 'https': f'http://127.0.0.1:{zap_port}'})
        print(f"Initializing ZAP client with proxies: {zap.proxies}")
        response = zap.core.version()  # Test API connection
        print(f"ZAP version: {response}")
        zap.urlopen(url)
        print(f"URL opened: {url}")
        time.sleep(2)

        spider_params = {'maxchildren': 10, 'recurse': True} if scan_type == 'zap_deep' else {}
        scan_id = zap.spider.scan(url, **spider_params)
        print(f"Spidering started, ID: {scan_id}")
        while int(zap.spider.status(scan_id)) < 100:
            print(f"Spider progress: {zap.spider.status(scan_id)}%")
            time.sleep(5)

        active_scan_id = zap.ascan.scan(url)
        print(f"Active scan started, ID: {active_scan_id}")
        while int(zap.ascan.status(active_scan_id)) < 100:
            print(f"Active scan progress: {zap.ascan.status(active_scan_id)}%")
            time.sleep(5)

        report = zap.core.htmlreport()
        if not report:
            raise Exception("Failed to generate ZAP report")
        print(f"Report generated successfully, length: {len(report)} bytes")
        return report

    except Exception as e:
        print(f"ZAP scan error: {str(e)}")
        import traceback
        traceback.print_exc()  # Print full stack trace
        raise
    finally:
        stop_zap_container(container_id)

def run_scan(url, scan_type, report_dir=None):
    """Run the specified scan type"""
    if scan_type not in VALID_SCAN_TYPES:
        raise ValueError(f"Invalid scan type: {scan_type}. Supported types: {', '.join(VALID_SCAN_TYPES)}")
    
    if not url:
        raise ValueError("URL cannot be empty")

    if scan_type in ['nmap_regular', 'nmap_deep']:
        return run_nmap_scan(url, scan_type)
    elif scan_type in ['zap_regular', 'zap_deep']:
        if not report_dir:
            raise ValueError("report_dir is required for ZAP scans")
        return run_zap_scan(url, scan_type, report_dir)