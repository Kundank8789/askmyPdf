"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);
  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-lg border border-white/20 
                 hover:border-white/40 hover:scale-110 transition-all active:scale-95 bg-white/10 dark:bg-black/20"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 animate-spin-slow" />
      ) : (
        <Moon className="w-5 h-5 animate-spin-slow" />
      )}
    </button>
  );
}
