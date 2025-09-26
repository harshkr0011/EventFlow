
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
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
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.besttravel.co.nz',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'blogs.tripzygo.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.tv9hindi.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.newsarenaindia.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.bhaskarassets.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.gujaratexpert.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'bxmysuru.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

    
    
