/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Enable experimental app directory
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
