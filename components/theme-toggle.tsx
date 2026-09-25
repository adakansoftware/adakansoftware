"use client"

import { Moon, Sun } from "lucide-react"

export function ThemeToggle({ locale }: { locale: "tr" | "en" }) {
  const toggleTheme = () => {
    const root = document.documentElement
    const useDarkTheme = !root.classList.contains("dark")

    root.classList.toggle("dark", useDarkTheme)
    root.style.colorScheme = useDarkTheme ? "dark" : "light"
    localStorage.setItem("theme", useDarkTheme ? "dark" : "light")
  }

  const label = locale === "tr" ? "Açık veya koyu temaya geç" : "Switch light or dark theme"

  return (
    <button className="studio-theme-toggle" type="button" onClick={toggleTheme} aria-label={label} title={label}>
      <Moon className="studio-theme-icon studio-theme-icon-moon" size={17} aria-hidden="true" />
      <Sun className="studio-theme-icon studio-theme-icon-sun" size={17} aria-hidden="true" />
    </button>
  )
}
