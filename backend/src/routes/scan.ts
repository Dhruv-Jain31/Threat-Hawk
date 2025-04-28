import express, { Request, Response, RequestHandler } from 'express';
import axios, { AxiosError } from 'axios';
import prisma from '../client';
import { authMiddleware, restrictTo } from '../middleware/auth';

const router = express.Router();

// Type for scan request body
interface ScanRequestBody {
  url: string;
  scan_type: 'zap_regular' | 'zap_deep' | 'nmap_regular' | 'nmap_deep';
  userId?: number; // Added by authMiddleware
  role?: string; // Added by authMiddleware
}

// Type for Flask response (adjust based on your Flask server's response structure)
interface FlaskResponse {
  scan_result: any; // JSON output from scraper
  report_path?: string; // Path to report file
}

// Trigger a scan and save to database
const scanHandler: RequestHandler = async (req: Request<{}, {}, ScanRequestBody>, res: Response): Promise<void> => {
  const { url, scan_type, userId } = req.body;

  console.log('Received userId:', userId); // Log to confirm userId is received

  try {
    // Validate request body
    if (!url || !scan_type || !userId) {
      res.status(400).json({ error: 'url, scan_type, and userId are required' });
      return;
    }

    const validScanTypes = ['zap_regular', 'zap_deep', 'nmap_regular', 'nmap_deep'];
    if (!validScanTypes.includes(scan_type)) {
      res.status(400).json({ error: 'Invalid scan_type' });
      return;
    }

    // Determine scan type for Prisma (WEB or NETWORK)
    const prismaScanType = scan_type.startsWith('zap') ? 'WEB' : 'NETWORK';

    // Create a pending scan record in the database
    const scan = await prisma.scan.create({
      data: {
        type: prismaScanType,
        target: url,
        status: 'PENDING',
        userId,
      },
    });

    try {
      // Make request to Flask server
      const flaskResponse = await axios.post<FlaskResponse>(
        `${process.env.FLASK_SERVER_URL}/scan`,
        { url, scan_type },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 60000, // 60 seconds
        }
      );

      // Update scan record with results
      await prisma.scan.update({
        where: { id: scan.id },
        data: {
          status: 'SUCCESS',
          scanResult: flaskResponse.data.scan_result,
          reportPath: flaskResponse.data.report_path || null,
        },
      });

      res.status(200).json({
        message: 'Scan completed successfully',
        scan: {
          id: scan.id,
          type: prismaScanType,
          target: url,
          status: 'SUCCESS',
          scanResult: flaskResponse.data.scan_result,
          reportPath: flaskResponse.data.report_path,
        },
      });
    } catch (flaskError) {
      // Update scan status to FAILED if Flask request fails
      await prisma.scan.update({
        where: { id: scan.id },
        data: { status: 'FAILED' },
      });

      throw flaskError; // Let the outer catch handle the response
    }
  } catch (error) {
    console.error('Error triggering scan:', error);
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      // Flask server responded with an error
      res.status(axiosError.response.status).json({
        error: axiosError.response.data.error || 'Flask server error',
      });
    } else if (axiosError.request) {
      // No response from Flask server
      res.status(503).json({ error: 'Flask server unreachable' });
    } else {
      // Other errors
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

// Apply authMiddleware to all scan routes
// Example: Restrict zap_deep and nmap_deep to admins
router.post('/', authMiddleware, scanHandler);
// router.post('/', authMiddleware, restrictTo('admin'), scanHandler); // Uncomment for admin-only scans

export default router;