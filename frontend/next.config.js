/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        ignored: ['**/node_modules/**', '**/.next/**', 'C:/hiberfil.sys', 'C:/pagefile.sys'],
      };
    }
    return config;
  },
}

module.exports = nextConfig
