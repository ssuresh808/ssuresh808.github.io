import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      '*.css': { loaders: ['@tailwindcss/turbopack'] },
    },
  },
};

export default nextConfig;
