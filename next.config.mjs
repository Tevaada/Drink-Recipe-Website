/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.thecocktaildb.com",
        pathname: "/images/media/drink/**",
      },
    ],
  },
};

export default nextConfig;