import sys
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import uuid
import logging
from datetime import datetime
# Use absolute import for clarity when running directly
from utils.scanner import run_scan, VALID_SCAN_TYPES

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ensure report directories exist
REPORTS_DIR = "reports"
ZAP_REPORTS_DIR = os.path.join(REPORTS_DIR, "zap")
NMAP_REPORTS_DIR = os.path.join(REPORTS_DIR, "nmap")

for directory in [REPORTS_DIR, ZAP_REPORTS_DIR, NMAP_REPORTS_DIR]:
    if not os.path.exists(directory):
        os.makedirs(directory)

@app.route('/scan', methods=['POST'])
def scan():
    """Initiate a vulnerability scan"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON data provided"}), 400

    url = data.get('url')
    scan_type = data.get('scan_type')

    if not url or not scan_type:
        return jsonify({"error": "Missing 'url' or 'scan_type' in request"}), 400

    if scan_type not in VALID_SCAN_TYPES:
        return jsonify({"error": f"Invalid scan_type. Supported types: {', '.join(VALID_SCAN_TYPES)}"}), 400

    try:
        # Run the scan with appropriate report directory for ZAP
        report_content = run_scan(url, scan_type, report_dir=ZAP_REPORTS_DIR if 'zap' in scan_type else NMAP_REPORTS_DIR)

        # Generate report ID and paths
        report_id = str(uuid.uuid4())  # Define report_id here
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        if 'nmap' in scan_type:
            report_path = os.path.join(NMAP_REPORTS_DIR, f"{report_id}.xml")
            display_path = os.path.join(NMAP_REPORTS_DIR, f"{report_id}_display.xml")
            with open(report_path, 'w', encoding='utf-8') as f:
                f.write(report_content)
            with open(display_path, 'w', encoding='utf-8') as f:
                f.write(report_content)
        else:  # ZAP scan
            report_path = os.path.join(ZAP_REPORTS_DIR, f"{report_id}.html")
            display_path = os.path.join(ZAP_REPORTS_DIR, f"{report_id}_display.html")
            with open(report_path, 'w', encoding='utf-8') as f:
                f.write(report_content)
            with open(display_path, 'w', encoding='utf-8') as f:
                f.write(report_content)

        logger.info(f"Scan completed for URL: {url}, Scan Type: {scan_type}, Report ID: {report_id}")
        return jsonify({
            "message": "Scan completed",
            "report_id": report_id,
            "report_path": f"reports/{'zap' if 'zap' in scan_type else 'nmap'}/{report_id}{'.html' if 'zap' in scan_type else '.xml'}"
        }), 200

    except Exception as e:
        logger.error(f"Scan failed: {str(e)}")
        return jsonify({"error": f"Scan failed: {str(e)}"}), 500

@app.route('/report/<report_id>', methods=['GET'])
def get_report(report_id):  # Add report_id as a parameter
    """Retrieve a scan report"""
    zap_report_path = os.path.join(ZAP_REPORTS_DIR, f"{report_id}_display.html")
    nmap_report_path = os.path.join(NMAP_REPORTS_DIR, f"{report_id}_display.xml")

    if os.path.exists(zap_report_path):
        return send_file(zap_report_path, mimetype='text/html')
    elif os.path.exists(nmap_report_path):
        return send_file(nmap_report_path, mimetype='application/xml')
    else:
        return jsonify({"error": "Report not found"}), 404
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)