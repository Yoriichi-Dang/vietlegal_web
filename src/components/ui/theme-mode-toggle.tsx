"use client";
import { useTheme } from "@/provider/theme-provider";
import React, { useEffect, useState } from "react";
import { Button } from "./button";
import SystemIcon from "../icons/system-icon";
import MoonIcon from "../icons/moon-icon";
import SunIcon from "../icons/sun-icon";

const ThemeModeToggle = () => {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [actualTheme, setActualTheme] = useState(resolvedTheme);
  useEffect(() => {
    setActualTheme(resolvedTheme);
    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.getAttribute("data-theme");
      if (newTheme === "light" || newTheme === "dark") {
        setActualTheme(newTheme);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, [resolvedTheme]);
  const toggleTheme = () => {
    const nextTheme =
      theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
    setTheme(nextTheme);
  };

  const icon =
    theme === "system" ? (
      <SystemIcon />
    ) : actualTheme === "dark" ? (
      <MoonIcon />
    ) : (
      <SunIcon />
    );

  return (
    <Button
      variant="ghost"
      size="icon"
      className="p-2 cursor-pointer border-2 border-foreground rounded-full"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {icon}
    </Button>
  );
};

export default ThemeModeToggle;
