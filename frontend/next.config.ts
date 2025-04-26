import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Ensure Prisma's query engine is included in the build
    if (!isServer) {
      config.resolve.fallback = {
        fs: false, // Prisma relies on fs, which isn't available in browser-side code
      }
    }
    return config
  },
}

export default nextConfig
