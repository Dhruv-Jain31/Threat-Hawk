import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth';
import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        // Create a JWT token for backend API calls
        const accessToken = sign(
            {
                userId: session.user.id,
                email: session.user.email,
                username: session.user.username,
            },
            process.env.NEXTAUTH_SECRET || 'secret',
            { expiresIn: '1h' }
        );

        return NextResponse.json({ accessToken });
    } catch (error) {
        console.error('Token generation error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
