// components/ThemeScript.tsx
import React from "react";

export function ThemeScript({ storageKey = "vietlegal-theme" }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              // Đầu tiên, lấy theme từ localStorage
              var savedTheme = localStorage.getItem('${storageKey}');
              var theme = savedTheme || 'dark'; // Mặc định dark nếu không có
              
              // Xử lý theme "system"
              if (theme === 'system') {
                theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              }
              
              // Áp dụng theme trước khi bất kỳ React code nào chạy
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
