import { Request, Response, RequestHandler } from 'express';
import { verify } from 'jsonwebtoken';

// Type for decoded JWT payload
interface JwtPayload {
  userId: string;
  username?: string;
  role?: string; // Optional role for RBAC
}

// Authentication middleware to verify JWT and extract userId
export const authMiddleware: RequestHandler = async (req: Request, res: Response, next: Function): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid Authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify JWT token using NextAuth secret
    const decoded = verify(token, process.env.NEXTAUTH_SECRET || 'secret') as JwtPayload;
    console.log('Decoded JWT:', decoded); // Log to confirm userId is present

    if (!decoded.userId) {
      res.status(401).json({ error: 'Unauthorized: Invalid token payload' });
      return;
    }

    // Add userId to request body (or use req.user for better practice)
    req.body.userId = parseInt(decoded.userId, 10);
    req.body.role = decoded.role || 'user'; // Default to 'user' role

    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// Role-based access control middleware
export const restrictTo = (...allowedRoles: string[]): RequestHandler => {
  return (req: Request, res: Response, next: Function): void => {
    const userRole = req.body.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      return;
    }

    next();
  };
};