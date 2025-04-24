/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable server-side rendering for pages that use client-side only modules
  reactStrictMode: true,
  swcMinify: true,
  // Configure webpack to handle client-side only modules
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };
    return config;
  },
  // Configure experimental features
  experimental: {
    appDir: true,
  },
  // Configure images
  images: {
    domains: ["localhost"],
  },
  // Configure environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
};

export default nextConfig;
