import axios, { AxiosError } from 'axios';

// Flask service base URL (update with your Flask service URL)
const FLASK_API_URL = process.env.FLASK_API_URL || 'http://localhost:6000';

// Interface for Flask scan-and-scrape response
interface FlaskScanResponse {
  status: 'success' | 'warning' | 'error';
  message?: string;
  report: {
    raw: string; // Raw report content (XML for Nmap, HTML for ZAP)
    scraped: any; // JSON from scraper.py
  };
}

// Trigger a scan and scrape by calling the Flask service
export const triggerFlaskScan = async (url: string, scanType: string): Promise<FlaskScanResponse> => {
  try {
    const response = await axios.post<FlaskScanResponse>(`${FLASK_API_URL}/scan-and-scrape`, {
      url,
      scan_type: scanType,
    }, {
      timeout: 1200000, // 20 minutes timeout for scans
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Flask API error: ${error.response?.data?.message || error.message}`);
    }
    throw new Error(`Flask API error: ${error}`);
  }
};