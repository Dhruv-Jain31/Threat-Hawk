import axios from 'axios';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { z } from 'zod';
import type { NextAuthOptions } from 'next-auth';

// Zod schema for credential validation
const credentialsSchema = z.object({
    email: z.string().email('Invalid email format').min(1, 'Email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters').min(1, 'Password is required'),
});

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                try {
                    // Validate credentials with Zod
                    credentialsSchema.parse(credentials);

                    if (!credentials?.email || !credentials?.password) {
                        throw new Error('Missing email or password.');
                    }

                    // Call the backend API using Axios
                    const response = await axios.post(
                        `${process.env.BACKEND_API_URL || 'http://localhost:5000'}/api/auth/login`,
                        {
                            email: credentials.email,
                            password: credentials.password,
                        },
                        {
                            headers: { 'Content-Type': 'application/json' },
                        }
                    );

                    const { user } = response.data;

                    if (!user) {
                        throw new Error('Invalid credentials.');
                    }

                    return {
                        id: user.id.toString(),
                        name: user.name,
                        email: user.email,
                        username: user.username,
                    };
                } catch (error: any) {
                    console.error('Authentication error:', error);
                    if (axios.isAxiosError(error) && error.response) {
                        throw new Error(error.response.data.error || 'Authentication failed.');
                    }
                    throw new Error('Authentication failed.');
                }
            },
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_ID || '',
            clientSecret: process.env.GOOGLE_SECRET || '',
        }),

        GitHubProvider({
            clientId: process.env.GITHUB_ID || '',
            clientSecret: process.env.GITHUB_SECRET || '',
            profile(profile) {
                return {
                    id: profile.id.toString(),
                    name: profile.name || profile.login,
                    email: profile.email,
                    username: profile.login, // GitHub username
                };
            },
        }),
    ],

    secret: process.env.NEXTAUTH_SECRET || 'secret',

    callbacks: {
        async signIn({ user, account }) {
            console.log('signIn callback:', { user, account }); // Log user and account data
            if (account?.provider === 'google' || account?.provider === 'github') {
                try {
                    // Call backend to create/update OAuth user
                    const response = await axios.post(
                        `${process.env.BACKEND_API_URL || 'http://localhost:5000'}/api/auth/oauth`,
                        {
                            email: user.email,
                            name: user.name,
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                            username: user.username,
                        },
                        {
                            headers: { 'Content-Type': 'application/json' },
                        }
                    );

                    const { user: dbUser } = response.data;

                    // Update user object with database ID
                    user.id = dbUser.id.toString();
                    user.username = dbUser.username;

                    return true; // Allow sign-in
                } catch (error) {
                    console.error('OAuth sign-in error:', error);
                    if (axios.isAxiosError(error)) {
                        console.error('Axios error details:', {
                            status: error.response?.status,
                            data: error.response?.data,
                            message: error.message,
                        });
                    }
                    return false; // Deny sign-in on error
                }
            }
            return true; // Allow sign-in for credentials
        },

        async jwt({ token, user }) {
            if (user) {
                token.userId = user.id;
                token.username = user.username;
            }
            return token;
        },

        async session({ session, token }: any) {
            if (session.user && token.userId) {
                session.user.id = token.userId;
                session.user.username = token.username;
            }
            return session;
        },
    },

    session: {
        strategy: 'jwt',
    },

    pages: {
        signIn: '/auth/signin',
    },
};