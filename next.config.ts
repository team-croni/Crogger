import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', port: '', pathname: '/**' },  // Google OAuth 이미지
      { protocol: 'https', hostname: 'avatars.githubusercontent.com', port: '', pathname: '/**' }, // GitHub 이미지
      { protocol: 'https', hostname: 'platform-lookaside.fbsbx.com', port: '', pathname: '/**' }, // Facebook 이미지
      { protocol: 'https', hostname: 'scontent.xx.fbcdn.net', port: '', pathname: '/**' }, // Facebook 이미지
      { protocol: 'https', hostname: 'i.pravatar.cc', port: '', pathname: '/**' }, // 랜덤 이미지 서비스
    ],
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.ts',
      },
    },
  },
  webpack: (config) => {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    )

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  }
};

export default nextConfig;
