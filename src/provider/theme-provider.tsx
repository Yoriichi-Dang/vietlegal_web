"use client";

import { createContext, useContext, useEffect, useState } from "react";

const initialState: ThemeProviderState = {
  theme: "dark",
  resolvedTheme: "dark",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "vietlegal-theme",
  ...props
}: ThemeProviderProps) {
  const [storedTheme, setStoredTheme] = useState<ThemeMode>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">(
    defaultTheme === "system" ? "dark" : (defaultTheme as "dark" | "light")
  );
  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey) as ThemeMode | null;
    if (savedTheme) {
      setStoredTheme(savedTheme);
    }
  }, [storageKey]);

  useEffect(() => {
    if (storedTheme === "system") {
      const systemPreference = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setResolvedTheme(systemPreference);

      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        const newTheme = e.matches ? "dark" : "light";
        setResolvedTheme(newTheme);

        applyTheme(newTheme);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      setResolvedTheme(storedTheme as "dark" | "light");
    }
  }, [storedTheme]);

  // Hàm áp dụng theme vào DOM
  const applyTheme = (theme: string) => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
  };

  // Áp dụng theme khi state thay đổi
  useEffect(() => {
    const theme = storedTheme === "system" ? resolvedTheme : storedTheme;
    localStorage.setItem(storageKey, storedTheme);
    applyTheme(theme);
  }, [storageKey, storedTheme, resolvedTheme]);

  const value = {
    theme: storedTheme,
    resolvedTheme,
    setTheme: (theme: ThemeMode) => {
      setStoredTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
