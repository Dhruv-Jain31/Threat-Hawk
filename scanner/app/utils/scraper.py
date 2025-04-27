from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
from bs4 import BeautifulSoup
import re
import json
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = 'nmap_report_parser_secret_key'  # For flash messages
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['ALLOWED_EXTENSIONS'] = {'html'}

# Create uploads folder if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)


def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']


def parse_nmap_report(html_content):
    """Parse the NMAP report HTML and extract key information."""
    soup = BeautifulSoup(html_content, 'html.parser')

    # Extract basic information
    title = soup.find('h1').text.strip() if soup.find('h1') else "NMAP Scan Report"

    # Extract generated date and scan type more reliably
    generated_date = ""
    scan_type = ""

    # Find all paragraphs and check for the generated date and scan type
    paragraphs = soup.find_all('p')
    for p in paragraphs:
        p_text = p.text.strip()
        if 'Generated:' in p_text:
            generated_date = p_text.replace('Generated:', '').strip()
        elif 'Scan Type:' in p_text:
            scan_type = p_text.replace('Scan Type:', '').strip()

    # Extract raw scan output
    pre_elem = soup.find('pre')
    if not pre_elem:
        return {"error": "Could not find scan output in the report"}

    raw_scan = pre_elem.text.strip()

    # Extract scan timestamp from raw output if not found in HTML
    if not generated_date:
        time_match = re.search(r'Starting Nmap .* at (.+)', raw_scan)
        if time_match:
            generated_date = time_match.group(1)

    # Parse the raw scan output to extract structured data
    scan_data = {}

    # Extract target IP address
    ip_match = re.search(r'Nmap scan report for (\d+\.\d+\.\d+\.\d+)', raw_scan)
    if ip_match:
        scan_data['target_ip'] = ip_match.group(1)

    # Extract OS detection
    os_match = re.search(r'OS fingerprint not ideal because: (.+)', raw_scan)
    if os_match:
        scan_data['os_detection_note'] = os_match.group(1).strip()

    # Extract ports and services
    scan_data['ports'] = []
    port_lines = re.findall(r'(\d+)/tcp\s+(\w+)\s+(\w+)(?:\s+(.+?))?(?=\n\d+/tcp|\n\||\n\w|\n$)', raw_scan, re.DOTALL)

    for port_info in port_lines:
        port, state, service = port_info[0:3]
        version = port_info[3].strip() if len(port_info) > 3 and port_info[3] else ""

        port_data = {
            'port': int(port),
            'state': state,
            'service': service,
            'version': version
        }
        scan_data['ports'].append(port_data)

    # Extract additional service info
    service_info_blocks = re.findall(r'(\d+/tcp).+?\n(\|.+?)(?=\n\d+/tcp|\nOS|\nTRACEROUTE|\nNmap done)', raw_scan,
                                     re.DOTALL)
    for port_str, info_block in service_info_blocks:
        port_num = int(port_str.split('/')[0])
        for port_data in scan_data['ports']:
            if port_data['port'] == port_num:
                if 'additional_info' not in port_data:
                    port_data['additional_info'] = []
                lines = info_block.strip().split('\n')
                for line in lines:
                    if line.startswith('|_'):
                        port_data['additional_info'].append(line[2:].strip())
                    elif line.startswith('|'):
                        port_data['additional_info'].append(line[1:].strip())

    # Extract network distance
    distance_match = re.search(r'Network Distance: (\d+) hops', raw_scan)
    if distance_match:
        scan_data['network_distance'] = int(distance_match.group(1))

    # Extract traceroute information
    traceroute_lines = re.findall(r'(\d+)\s+(\d+\.\d+) ms\s+([\d\.]+)', raw_scan)
    if traceroute_lines:
        scan_data['traceroute'] = []
        for hop, rtt, address in traceroute_lines:
            scan_data['traceroute'].append({
                'hop': int(hop),
                'rtt': float(rtt),
                'address': address
            })

    # If scan_type is still empty, set a default value
    if not scan_type:
        if "OS and Service detection performed" in raw_scan:
            scan_type = "OS and Service detection"
        else:
            scan_type = "Standard scan"

    # Combine all the information
    report_data = {
        'title': title,
        'generated_date': generated_date,
        'scan_type': scan_type,
        'scan_data': scan_data,
        'summary': generate_summary(scan_data)
    }

    return report_data


def generate_summary(scan_data):
    """Generate a simple summary of the scan results."""
    summary = []

    if 'target_ip' in scan_data:
        summary.append(f"Target IP: {scan_data['target_ip']}")

    if 'ports' in scan_data:
        open_ports = [p for p in scan_data['ports'] if p['state'] == 'open']
        closed_ports = [p for p in scan_data['ports'] if p['state'] == 'closed']
        filtered_ports = [p for p in scan_data['ports'] if p['state'] == 'filtered']

        if open_ports:
            summary.append(f"Found {len(open_ports)} open port(s):")
            for port in open_ports:
                version_info = f" ({port['version']})" if port['version'] else ""
                summary.append(f"  - Port {port['port']}: {port['service']}{version_info}")

        if closed_ports:
            summary.append(f"Found {len(closed_ports)} closed port(s):")
            for port in closed_ports:
                summary.append(f"  - Port {port['port']}: {port['service']}")

        if filtered_ports:
            summary.append(f"Found {len(filtered_ports)} filtered port(s):")
            for port in filtered_ports:
                summary.append(f"  - Port {port['port']}: {port['service']}")

    return summary


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/upload', methods=['POST'])
def upload_file():
    # Check if a file was uploaded
    if 'file' not in request.files:
        flash('No file part')
        return redirect(request.url)

    file = request.files['file']

    # If user doesn't select file, browser also
    # submits an empty part without filename
    if file.filename == '':
        flash('No selected file')
        return redirect(request.url)

    if file and allowed_file(file.filename):
        # Read the file content
        file_content = file.read().decode('utf-8')

        # Parse the NMAP report
        report_data = parse_nmap_report(file_content)

        if 'error' in report_data:
            flash(report_data['error'])
            return redirect(request.url)

        # Save the parsed report for display
        filename = secure_filename(file.filename)
        parsed_filename = os.path.splitext(filename)[0] + '_parsed.json'
        parsed_filepath = os.path.join(app.config['UPLOAD_FOLDER'], parsed_filename)

        with open(parsed_filepath, 'w') as f:
            json.dump(report_data, f, indent=2)

        return render_template('index.html', report=report_data)

    flash('Only HTML files are allowed')
    return redirect(request.url)


@app.route('/raw_content', methods=['POST'])
def parse_raw_content():
    # Get the raw HTML content from the form
    raw_content = request.form.get('raw_content', '')

    if not raw_content:
        flash('No content provided')
        return redirect(url_for('index'))

    # Parse the NMAP report
    report_data = parse_nmap_report(raw_content)

    if 'error' in report_data:
        flash(report_data['error'])
        return redirect(url_for('index'))

    return render_template('index.html', report=report_data)


if __name__ == '__main__':
    app.run(debug=True)