/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    localPatterns: [
      {
        pathname: "/api/image",
        // omit search so any query string (e.g. ?url=...) is allowed
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fakestoreapi.com",
      },
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
      },
      {
        protocol: "https",
        hostname: "cdn.verk.net",
      },
      {
        protocol: "https",
        hostname: "www.clever-media.ru",
      },
    ],
  },
};

module.exports = nextConfig;
