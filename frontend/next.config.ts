import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        appDir: true,
    },
    env: {
        CUSTOM_KEY: process.env.CUSTOM_KEY,
    },
    async rewrites() {
        return [
            {
                source: '/api/backend/:path*',
                destination: `${process.env.BACKEND_API_URL}/api/:path*`,
            },
        ];
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
