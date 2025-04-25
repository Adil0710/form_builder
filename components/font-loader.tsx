"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"
import { useFormBuilderStore } from "@/lib/store"
import { applyFont, fonts } from "@/components/theme-preview"
import { applyTheme } from "@/components/theme-preview"

export function FontLoader() {
  const { selectedFont, selectedTheme } = useFormBuilderStore()
  const { theme, resolvedTheme, setTheme } = useTheme()

  // Load saved color mode on mount
  useEffect(() => {
    const savedColorMode = localStorage.getItem("colorMode")
    if (savedColorMode) {
      setTheme(savedColorMode)
    }
  }, [setTheme])

  // Load and apply the selected font
  useEffect(() => {
    // Load all fonts to prevent layout shifts when switching
    fonts.forEach((font) => {
      if (font.name !== "Default (System UI)") {
        const fontName = font.name.replace(/\s+/g, "+")
        const link = document.createElement("link")
        link.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@400;500;600;700&display=swap`
        link.rel = "stylesheet"
        document.head.appendChild(link)
      }
    })

    // Apply the selected font
    if (selectedFont) {
      applyFont(selectedFont)
      // Save font name to localStorage
      localStorage.setItem("selectedFontName", selectedFont.name)
    }
  }, [selectedFont])

  // Apply theme when it changes or when dark mode changes
  useEffect(() => {
    if (selectedTheme) {
      applyTheme(selectedTheme)
    }
  }, [selectedTheme, theme, resolvedTheme])

  return null
}
