/** @type {import('next').NextConfig} */
const nextConfig = {
  staticPageGenerationTimeout: 220,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
        port: '',
        search: '',
      },
    ],
  }
};

export default nextConfig;
