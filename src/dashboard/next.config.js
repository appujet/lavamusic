/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['cdn.discordapp.com'],
    },
    async rewrites() {
        return [
            {
                source: '/src/app/dashboard/index.tsx',
                destination: '/dashboard',
            }
        ];
    },
}

module.exports = nextConfig
