/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // generates static HTML/CSS/JS in 'out' folder
  images: { unoptimized: true }, // required for static export
  trailingSlash: true, // optional but helps with routing
};

module.exports = nextConfig;