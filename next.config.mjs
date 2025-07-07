/** @type {import('next').NextConfig} */
const nextConfig = {
  staticPageGenerationTimeout: 240,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
        port: '',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      }
    ],
  }
};

export default nextConfig;