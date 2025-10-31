/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
            {
                protocol: 'https',
                hostname: 'places.googleapis.com',
                port: '',
                pathname: '/**',
            },
        ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // or '20mb' as needed
    },
  },
};

module.exports = nextConfig;