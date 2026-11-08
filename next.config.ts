import type {NextConfig} from 'next';

const allowedDevOrigins: string[] = [];
// In a development environment like Firebase Studio, the preview may be served from a different origin.
// We can use the WEB_PREVIEW_URL environment variable (if provided by the environment) to allow it.
if (process.env.WEB_PREVIEW_URL) {
  allowedDevOrigins.push(process.env.WEB_PREVIEW_URL);
}

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
