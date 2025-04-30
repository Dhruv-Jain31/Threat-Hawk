// pages/api/scan.ts
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth';; // Adjust path to your NextAuth config
import { sign } from 'jsonwebtoken';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // Get the user's session from NextAuth
  const session = await getServerSession(authOptions);

  // Check if the user is authenticated
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Create a JWT payload with user data
  const payload = {
    userId: session.user.id,
    email: session.user.email,
    username: session.user.username,
  };

  // Generate a JWT (use your secret key)
  const token = sign(payload, process.env.NEXTAUTH_SECRET || 'secret', {
    algorithm: 'HS256',
    expiresIn: '1h',
  });

  try {
    // Get the request body (e.g., { target, scanType })
    const body = await req.json();

    // Call the backend’s scan-and-scrape endpoint
    const backendResponse = await axios.post(
      'http://localhost:5000/api/scan-and-scrape',
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Return the backend’s JSON response to the frontend
    return NextResponse.json(backendResponse.data, { status: 200 });
  } catch (error) {
    console.error('Error calling backend:', error);
    return NextResponse.json({ error: 'Failed to perform scan' }, { status: 500 });
  }
}