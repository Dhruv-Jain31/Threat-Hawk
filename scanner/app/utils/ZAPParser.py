'''
from flask import Flask, request, jsonify, render_template
from bs4 import BeautifulSoup
import json
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']
    if not file:
        return "No file uploaded", 400

    soup = BeautifulSoup(file, 'html.parser')

    # Basic Info
    site = soup.find('h2').text.replace('Site: ', '').strip()
    generated_on = soup.find_all('h3')[0].text.replace('Generated on', '').strip()
    zap_version = soup.find_all('h3')[1].text.replace('ZAP Version:', '').strip()

    # Summary
    summary = {}
    summary_table = soup.find('table', class_='summary')
    for row in summary_table.find_all('tr')[1:]:
        cells = row.find_all('td')
        if len(cells) >= 2:
            risk_level = cells[0].div.get_text(strip=True)
            count = cells[1].div.get_text(strip=True)
            summary[risk_level] = int(count)

    # Alerts + Description + Solution
    alerts = []
    alerts_table = soup.find('table', class_='alerts')
    alert_links = [a['href'][1:] for a in alerts_table.select('a[href]')]

    for alert_id in alert_links:
        alert_section = soup.find('a', id=alert_id)
        if alert_section:
            table = alert_section.find_parent('table')

            # Extract
            name = table.find_all('th')[1].text.strip()
            risk_level = table.find_all('th')[0].text.strip()

            instances_tag = table.find('td', string='Instances')
            instances = int(instances_tag.find_next_sibling('td').text.strip()) if instances_tag else 1

            description_tag = table.find('td', string='Description')
            description = ""
            if description_tag:
                description = description_tag.find_next_sibling('td').get_text(strip=True)

            solution_tag = table.find('td', string='Solution')
            solution = ""
            if solution_tag:
                solution = solution_tag.find_next_sibling('td').get_text(strip=True)

            alerts.append({
                'name': name,
                'risk_level': risk_level,
                'instances': instances,
                'description': description,
                'solution': solution
            })

    output = {
        'site': site,
        'generated_on': generated_on,
        'zap_version': zap_version,
        'summary': summary,
        'alerts': alerts
    }

    return jsonify(output)



if __name__ == '__main__':
    app.run(debug=True)
'''
