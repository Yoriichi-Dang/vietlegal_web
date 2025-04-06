// components/ThemeScript.tsx
import React from "react";

export function ThemeScript({ storageKey = "vietlegal-theme" }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var savedTheme = localStorage.getItem('${storageKey}');
              var theme = savedTheme || 'dark'; // Mặc định dark nếu không có
              if (theme === 'system') {
                theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              }
              document.documentElement.classList.add(theme);
              document.documentElement.setAttribute('data-theme', theme);
              document.documentElement.style.colorScheme = theme;
            } catch (e) {
              console.error('Theme initialization failed:', e);
            }
          })();
        `,
      }}
    />
  );
}
