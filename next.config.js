/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "lh3.googleusercontent.com",
      "res.cloudinary.com",
    ],
  },
  experimental: { serverActions: true },
};

module.exports = nextConfig;
