"use client"

import type * as React from "react"
import { useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes"
import { useFormBuilderStore } from "@/lib/store"
import { themes, fonts } from "@/components/theme-preview"

type ThemeProviderProps = {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <ThemeApplier>{children}</ThemeApplier>
    </NextThemesProvider>
  )
}

function ThemeApplier({ children }: { children: React.ReactNode }) {
  const { selectedTheme, setSelectedTheme, selectedFont, setSelectedFont } = useFormBuilderStore()
  const { resolvedTheme, setTheme } = useNextTheme()
  const [mounted, setMounted] = useState(false)

  // Load saved theme and font from localStorage on mount
  useEffect(() => {
    setMounted(true)

    // Load theme from localStorage
    const savedThemeName = localStorage.getItem("selectedThemeName")
    const savedFontName = localStorage.getItem("selectedFontName")

    if (savedThemeName) {
      const foundTheme = themes.find((t) => t.name === savedThemeName)
      if (foundTheme) {
        setSelectedTheme(foundTheme)
      }
    }

    if (savedFontName) {
      const foundFont = fonts.find((f) => f.name === savedFontName)
      if (foundFont) {
        setSelectedFont(foundFont)
      }
    }

    // Set color mode (light/dark)

  }, [setSelectedTheme, setSelectedFont])

  // Save theme and color mode when they change
  useEffect(() => {
    if (!mounted || !selectedTheme) return

    const root = document.documentElement
    const isDark = resolvedTheme === "dark"

    // Save current theme name and color mode
    localStorage.setItem("selectedThemeName", selectedTheme.name)


    const variables = isDark ? selectedTheme.darkCssVariables : selectedTheme.cssVariables

    if (variables) {
      Object.entries(variables).forEach(([key, value]) => {
        root.style.setProperty(key, value)
      })
    }
  }, [resolvedTheme, selectedTheme, mounted])

  // Avoid hydration mismatch
  return mounted ? <>{children}</> : null
}
