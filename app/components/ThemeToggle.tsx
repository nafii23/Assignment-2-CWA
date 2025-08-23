"use client";

import { useEffect, useState } from "react";

const getPreferred = () => {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
  const osPref = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  return osPref ? "dark" : "light";
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(getPreferred());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      className="menu-btn"
      type="button"
      aria-label={`Activate ${theme === "dark" ? "light" : "dark"} mode`}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
    </button>
  );
}
