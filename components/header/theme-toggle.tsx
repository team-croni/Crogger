'use client'

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <button
      onClick={() => {
        if (theme === 'dark') {
          setTheme('light');
        } else if (theme === 'light') {
          setTheme('system');
        } else {
          setTheme('dark');
        }
      }}
      className="flex items-center justify-center bg-input w-9 h-9 border border-input-border hover:border-muted-foreground/50 text-foreground rounded-full"
      aria-label="테마 토글"
    >
      {mounted && theme === 'dark' ? (
        <Sun className="w-4 h-4" />
      ) : mounted && theme === 'light' ? (
        <Moon className="w-4 h-4" />
      ) : mounted && theme === 'system' ? (
        <Monitor className="w-4 h-4" />
      ) : (
        <Sun className="w-4 h-4" />
      )}
    </button>
  )
}

export default ThemeToggle;