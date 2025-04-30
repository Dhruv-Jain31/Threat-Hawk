import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { sign } from 'jsonwebtoken';
import { authOptions } from '../../../lib/auth'; // Adjust path to your auth.ts

// GET /api/auth/get-token
export async function GET(req: NextRequest) {
  try {
    // Get server-side session
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized: No session found' }, { status: 401 });
    }

    // Create a JWT payload matching backend expectations
    const payload = {
      userId: session.user.id,
      email: session.user.email,
      username: session.user.username,
    };

    // Sign the JWT with NEXTAUTH_SECRET
    const token = sign(payload, process.env.NEXTAUTH_SECRET || 'secret', {
      algorithm: 'HS256',
      expiresIn: '1d',
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}