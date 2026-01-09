import "@styles/globals.css";
import 'ldrs/react/Ring.css'
import { baloo, pretendard } from "@public/fonts";
import ThemeProvider from "@components/provider/theme-provider";

export const metadata = {
  title: {
    default: 'Crogger',
  },
  description: "Crogger는 Axiom 로그를 관리하고 분석할 수 있는 오픈소스 시스템입니다. 실시간 로그 모니터링, 고급 필터링, 대시보드 시각화 기능을 제공합니다.",
  keywords: ['로그 분석', 'Axiom', '로그 모니터링', '로그 뷰어', '로그 분석 대시보드', '로그 필터링', '로그 시각화', '오픈소스'],
  authors: [{ name: 'Croni', url: 'https://github.com/team-croni/crogger.git' }],
  creator: 'Croni',
  publisher: 'Croni',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}`,
    title: 'Crogger - Axiom 로그 분석 대시보드',
    description: "Crogger는 Axiom 로그를 관리하고 분석할 수 있는 오픈소스 시스템입니다. 실시간 로그 모니터링, 고급 필터링, 대시보드 시각화 기능을 제공합니다.",
    siteName: 'Crogger',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Crogger - Axiom 로그 분석 대시보드',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crogger - Axiom 로그 분석 대시보드',
    description: "Crogger는 Axiom 로그를 관리하고 분석할 수 있는 오픈소스 시스템입니다. 실시간 로그 모니터링, 고급 필터링, 대시보드 시각화 기능을 제공합니다.",
    images: [`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/og-image.png`],
  },
  icons: {
    icon: "/favicon.ico",
  },
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}`),
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeInitializerScript = `
    try {
      // 단순 문자열 방식의 테마 초기화
      let initialTheme = localStorage.getItem('theme');
      
      if (!initialTheme) {
        // 저장된 테마가 없을 경우 시스템 기본값 사용
        initialTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      
      if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (initialTheme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        // system mode - 시스템 기본값 사용
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    } catch (_) {
      // 오류 발생 시 기본값으로 처리
      try {
        document.documentElement.classList.remove('dark');
      } catch (_) {}
    }
  `;

  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitializerScript }} />
      </head>
      <body
        className={`${pretendard.variable} ${baloo.variable} flex h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
          storageKey="theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
