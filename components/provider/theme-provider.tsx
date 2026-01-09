"use client";

import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // 서버에서는 항상 새로운 QueryClient 생성
    return makeQueryClient();
  } else {
    // 브라우저에서는 싱글톤 패턴으로 관리
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider {...props}>
        {children}
      </NextThemesProvider>
    </QueryClientProvider>
  );
}

export default ThemeProvider;