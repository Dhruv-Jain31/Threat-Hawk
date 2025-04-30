import { Request, Response, RequestHandler } from 'express';
import { verify } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface JwtPayload {
  userId: string;
  email?: string;
  username?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        email: string;
      };
    }
  }
}

export const authMiddleware: RequestHandler = async (req: Request, res: Response, next: Function): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid Authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];
  console.log('Received token:', token); // Log the token

  try {
    const decoded = verify(token, process.env.NEXTAUTH_SECRET || 'secret') as JwtPayload;
    console.log('Decoded JWT:', decoded);

    if (!decoded.userId) {
      res.status(401).json({ error: 'Unauthorized: Invalid token payload' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(decoded.userId, 10) },
      select: { id: true, username: true, email: true },
    });

    if (!user) {
      res.status(401).json({ error: 'Unauthorized: User not found' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export const restrictTo = (...allowedRoles: string[]): RequestHandler => {
  return (req: Request, res: Response, next: Function): void => {
    const userRole = req.body.role || 'user';
    if (!userRole || !allowedRoles.includes(userRole)) {
      res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      return;
    }
    next();
  };
};