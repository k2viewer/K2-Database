/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dies stellt sicher, dass Next.js nicht versucht, 
  // die Seite statisch zu exportieren, was oft zu 404s führt
  output: 'standalone',
};

export default nextConfig;
