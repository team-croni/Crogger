import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/api/',
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: '/api/',
      },
      {
        userAgent: 'Slurp',
        allow: '/',
        disallow: '/api/',
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/sitemap.xml`,
    host: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  };
}