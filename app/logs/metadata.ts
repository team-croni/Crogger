import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '로그 분석 대시보드 | Crogger - Axiom 로그 분석 도구',
  description: '실시간 Axiom 로그를 분석하고 시각화하는 대시보드입니다. 로그 수준별 통계, 검색 필터, 차트 분석 기능을 통해 로그 데이터를 효과적으로 관리하고 문제를 빠르게 해결할 수 있습니다.',
  keywords: ['로그 분석', 'Axiom', '로그 대시보드', '로그 시각화', '로그 검색', '로그 필터', '시스템 모니터링', '개발자 도구'],
  openGraph: {
    title: '로그 분석 대시보드 | Crogger - Axiom 로그 분석 도구',
    description: '실시간 Axiom 로그를 분석하고 시각화하는 대시보드입니다. 로그 수준별 통계, 검색 필터, 차트 분석 기능을 통해 로그 데이터를 효과적으로 관리하고 문제를 빠르게 해결할 수 있습니다.',
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/logs`,
    siteName: 'Crogger',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image-logs.png',
        width: 1200,
        height: 630,
        alt: 'Crogger 로그 분석 대시보드',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '로그 분석 대시보드 | Crogger - Axiom 로그 분석 도구',
    description: '실시간 Axiom 로그를 분석하고 시각화하는 대시보드입니다. 로그 수준별 통계, 검색 필터, 차트 분석 기능을 통해 로그 데이터를 효과적으로 관리하고 문제를 빠르게 해결할 수 있습니다.',
    images: ['/og-image-logs.png'],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/logs`,
  },
};