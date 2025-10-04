/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    // Advanced features
    serverComponentsExternalPackages: ['sharp'],
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  webpack: (config, { isServer }) => {
    // Module Federation disabled temporarily due to compatibility issues with Next.js 14
    // if (!isServer) {
    //   config.plugins.push(
    //     new webpack.container.ModuleFederationPlugin({
    //       name: 'quantumVisionAI',
    //       filename: 'remoteEntry.js',
    //       exposes: {
    //         './Dashboard': './src/components/Dashboard',
    //         './CameraFeed': './src/components/CameraFeed',
    //         './Analytics': './src/components/Analytics',
    //       },
    //       shared: {
    //         react: { singleton: true, requiredVersion: '^18.0.0' },
    //         'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
    //         'lucide-react': { singleton: true },
    //         '@radix-ui/react-slot': { singleton: true },
    //       },
    //     })
    //   );
    // }
    
    // Advanced optimizations
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
          },
          ai: {
            test: /[\\/]src[\\/]lib[\\/]ai[\\/]/,
            name: 'ai',
            chunks: 'all',
            priority: 8,
          },
        },
      },
    };
    
    return config;
  },
  
  // Advanced image optimization
  images: {
    domains: ['localhost', 'api.quantumvision.ai'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Compression and optimization
  compress: true,
  poweredByHeader: false,
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  
  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
