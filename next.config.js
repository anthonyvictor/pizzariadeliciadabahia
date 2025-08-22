/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // Desativa PWA no ambiente de desenvolvimento
});

const nextConfig = withPWA({
  images: {
    domains: ["i.ibb.co"],
  },
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
});

module.exports = nextConfig;
