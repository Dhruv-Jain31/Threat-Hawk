import express, { Request, Response, RequestHandler } from 'express';
import { authMiddleware } from '../middleware/auth';
import prisma from '../client';
import { triggerFlaskScan } from '../utils/flaskClient';
import path from 'path';
import fs from 'fs';

// Wrapper to handle async RequestHandler
const asyncHandler = (fn: (req: Request, res: Response, next: Function) => Promise<any>): RequestHandler => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

const router = express.Router();

// Map frontend scan types to Flask scan types
const scanTypeMap: { [key: string]: string } = {
    WEB: 'zap_regular',
    WEB_DEEP: 'zap_deep',
    NETWORK: 'nmap_regular',
    NETWORK_DEEP: 'nmap_deep',
};

// Protected route - requires authentication
const scanHandler = asyncHandler(async (req: Request, res: Response) => {
    const { target, type } = req.body;
    const userId = req.user?.id; // This comes from authMiddleware

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
    }

    if (!target || !type || !['WEB', 'WEB_DEEP', 'NETWORK', 'NETWORK_DEEP'].includes(type)) {
        return res.status(400).json({ error: 'Invalid request: target and type are required' });
    }

    let scanId: number | undefined;

    try {
        // Create a pending scan record
        const scan = await prisma.scan.create({
            data: {
                type,
                target,
                status: 'PENDING',
                userId,
            },
        });
        scanId = scan.id;

        // Trigger Flask scan
        const flaskResponse = await triggerFlaskScan(target, scanTypeMap[type] || 'nmap_regular');

        console.log('Full Flask response:', JSON.stringify(flaskResponse, null, 2));

        let scanResult: any = null;
        if (flaskResponse) {
            scanResult = flaskResponse;
        }

        const reportPath = scanResult
            ? path.join(__dirname, '../../scanner/reports', `${scan.id}.xml`)
            : null;

        await prisma.scan.update({
            where: { id: scan.id },
            data: {
                status: scanResult ? 'SUCCESS' : 'FAILED',
                scanResult,
                reportPath,
            },
        });

        return res.status(200).json({
            status: 'success',
            scanId: scan.id,
            message: 'Scan completed',
            scanResult,
        });
    } catch (error: any) {
        console.error('Scan error:', error);
        if (scanId) {
            await prisma.scan.update({
                where: { id: scanId },
                data: { status: 'FAILED' },
            });
        }
        return res.status(500).json({ error: `Scan failed: ${error.message || 'Unknown error'}` });
    }
});

// Get user's scans (protected route)
const getUserScansHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
    }

    try {
        const scans = await prisma.scan.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                type: true,
                target: true,
                status: true,
                createdAt: true,
            },
        });

        res.json({ scans });
    } catch (error: any) {
        console.error('Get user scans error:', error);
        res.status(500).json({ error: 'Failed to fetch scans' });
    }
});

// Download a scan report (protected route)
const downloadHandler = asyncHandler(async (req: Request, res: Response) => {
    const { scanId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
    }

    try {
        const scan = await prisma.scan.findUnique({
            where: { id: parseInt(scanId, 10) },
            select: { reportPath: true, userId: true, type: true },
        });

        if (!scan) {
            return res.status(404).json({ error: 'Scan not found' });
        }

        // Ensure user owns this scan
        if (scan.userId !== userId) {
            return res.status(403).json({ error: 'Forbidden: You do not own this scan' });
        }

        if (!scan.reportPath || !fs.existsSync(scan.reportPath)) {
            return res.status(404).json({ error: 'Report file not found' });
        }

        const fileName = `scan_${scanId}_${scan.type.toLowerCase()}.${scan.type.startsWith('WEB') ? 'html' : 'xml'}`;
        res.download(scan.reportPath, fileName);
    } catch (error: any) {
        console.error('Download error:', error);
        return res.status(500).json({ error: `Failed to download report: ${error.message || 'Unknown error'}` });
    }
});

// Apply authMiddleware to all protected routes
router.post('/', authMiddleware, scanHandler);
router.get('/my-scans', authMiddleware, getUserScansHandler);
router.get('/download/:scanId', authMiddleware, downloadHandler);

export default router;