/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "lh3.googleusercontent.com",
      "res.cloudinary.com",
      "avatars.githubusercontent.com",
    ],
  },
  experimental: { serverActions: true },
};

module.exports = nextConfig;
