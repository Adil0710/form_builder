export type ThemeOption = {
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
    muted: string
    border: string
  }
  cssVariables: Record<string, string>
  darkCssVariables?: Record<string, string>
}

export type FontOption = {
  name: string
  fontFamily: string
  cssVariable: string
}

// Predefined themes
export const themes: ThemeOption[] = [
  {
    name: "Default",
    colors: {
      primary: "0 0% 9%",
      secondary: "0 0% 96.1%",
      accent: "0 0% 96.1%",
      background: "0 0% 100%",
      foreground: "0 0% 3.9%",
      muted: "0 0% 96.1%",
      border: "0 0% 89.8%",
    },
    cssVariables: {
      "--primary": "0 0% 9%",
      "--primary-foreground": "0 0% 98%",
      "--secondary": "0 0% 96.1%",
      "--secondary-foreground": "0 0% 9%",
      "--accent": "0 0% 96.1%",
      "--accent-foreground": "0 0% 9%",
      "--background": "0 0% 100%",
      "--foreground": "0 0% 3.9%",
      "--muted": "0 0% 96.1%",
      "--muted-foreground": "0 0% 45.1%",
      "--border": "0 0% 89.8%",
      "--input": "0 0% 89.8%",
      "--ring": "0 0% 3.9%",
    },
    darkCssVariables: {
      "--primary": "0 0% 98%",
      "--primary-foreground": "0 0% 9%",
      "--secondary": "0 0% 14.9%",
      "--secondary-foreground": "0 0% 98%",
      "--accent": "0 0% 14.9%",
      "--accent-foreground": "0 0% 98%",
      "--background": "0 0% 3.9%",
      "--foreground": "0 0% 98%",
      "--muted": "0 0% 14.9%",
      "--muted-foreground": "0 0% 63.9%",
      "--border": "0 0% 14.9%",
      "--input": "0 0% 14.9%",
      "--ring": "0 0% 83.1%",
    },
  },
  {
    name: "Blue",
    colors: {
      primary: "221.2 83.2% 53.3%",
      secondary: "210 40% 96.1%",
      accent: "210 40% 96.1%",
      background: "0 0% 100%",
      foreground: "222.2 84% 4.9%",
      muted: "210 40% 96.1%",
      border: "214.3 31.8% 91.4%",
    },
    cssVariables: {
      "--primary": "221.2 83.2% 53.3%",
      "--primary-foreground": "210 40% 98%",
      "--secondary": "210 40% 96.1%",
      "--secondary-foreground": "222.2 47.4% 11.2%",
      "--accent": "210 40% 96.1%",
      "--accent-foreground": "222.2 47.4% 11.2%",
      "--background": "0 0% 100%",
      "--foreground": "222.2 84% 4.9%",
      "--muted": "210 40% 96.1%",
      "--muted-foreground": "215.4 16.3% 46.9%",
      "--border": "214.3 31.8% 91.4%",
      "--input": "214.3 31.8% 91.4%",
      "--ring": "221.2 83.2% 53.3%",
    },
    darkCssVariables: {
      "--primary": "217.2 91.2% 59.8%",
      "--primary-foreground": "0 0% 100%", // Fixed: Changed to white for better contrast
      "--secondary": "217.2 32.6% 17.5%",
      "--secondary-foreground": "210 40% 98%",
      "--accent": "217.2 32.6% 17.5%",
      "--accent-foreground": "210 40% 98%",
      "--background": "222.2 84% 4.9%",
      "--foreground": "210 40% 98%",
      "--muted": "217.2 32.6% 17.5%",
      "--muted-foreground": "215 20.2% 65.1%",
      "--border": "217.2 32.6% 17.5%",
      "--input": "217.2 32.6% 17.5%",
      "--ring": "224.3 76.3% 48%",
    },
  },
  {
    name: "Green",
    colors: {
      primary: "142.1 76.2% 36.3%",
      secondary: "138 69% 95%",
      accent: "138 69% 95%",
      background: "0 0% 100%",
      foreground: "20 14.3% 4.1%",
      muted: "138 69% 95%",
      border: "142 44.9% 86.7%",
    },
    cssVariables: {
      "--primary": "142.1 76.2% 36.3%",
      "--primary-foreground": "0 0% 100%", // Fixed: Changed to white for better contrast
      "--secondary": "138 69% 95%",
      "--secondary-foreground": "142.1 76.2% 36.3%",
      "--accent": "138 69% 95%",
      "--accent-foreground": "142.1 76.2% 36.3%",
      "--background": "0 0% 100%",
      "--foreground": "20 14.3% 4.1%",
      "--muted": "138 69% 95%",
      "--muted-foreground": "142 14.3% 42.1%",
      "--border": "142 44.9% 86.7%",
      "--input": "142 44.9% 86.7%",
      "--ring": "142.1 76.2% 36.3%",
    },
    darkCssVariables: {
      "--primary": "142.1 70.6% 45.3%",
      "--primary-foreground": "0 0% 100%", // Fixed: Changed to white for better contrast
      "--secondary": "144.9 30.3% 15.9%",
      "--secondary-foreground": "138 69% 95%",
      "--accent": "144.9 30.3% 15.9%",
      "--accent-foreground": "138 69% 95%",
      "--background": "20 14.3% 4.1%",
      "--foreground": "138 69% 95%",
      "--muted": "144.9 30.3% 15.9%",
      "--muted-foreground": "142 14.3% 70.1%",
      "--border": "144.9 30.3% 15.9%",
      "--input": "144.9 30.3% 15.9%",
      "--ring": "142.1 76.2% 36.3%",
    },
  },
  {
    name: "Purple",
    colors: {
      primary: "262.1 83.3% 57.8%",
      secondary: "260 60% 96.1%",
      accent: "260 60% 96.1%",
      background: "0 0% 100%",
      foreground: "224 71.4% 4.1%",
      muted: "260 60% 96.1%",
      border: "262.1 83.3% 57.8%",
    },
    cssVariables: {
      "--primary": "262.1 83.3% 57.8%",
      "--primary-foreground": "0 0% 100%", // Fixed: Changed to white for better contrast
      "--secondary": "260 60% 96.1%",
      "--secondary-foreground": "262.1 83.3% 57.8%",
      "--accent": "260 60% 96.1%",
      "--accent-foreground": "262.1 83.3% 57.8%",
      "--background": "0 0% 100%",
      "--foreground": "224 71.4% 4.1%",
      "--muted": "260 60% 96.1%",
      "--muted-foreground": "220 8.9% 46.1%",
      "--border": "260 60% 91.7%",
      "--input": "260 60% 91.7%",
      "--ring": "262.1 83.3% 57.8%",
    },
    darkCssVariables: {
      "--primary": "263.4 70% 50.4%",
      "--primary-foreground": "0 0% 100%", // Fixed: Changed to white for better contrast
      "--secondary": "260 16.3% 17.5%",
      "--secondary-foreground": "260 60% 96.1%",
      "--accent": "260 16.3% 17.5%",
      "--accent-foreground": "260 60% 96.1%",
      "--background": "224 71.4% 4.1%",
      "--foreground": "260 60% 96.1%",
      "--muted": "260 16.3% 17.5%",
      "--muted-foreground": "220 8.9% 76.1%",
      "--border": "260 16.3% 17.5%",
      "--input": "260 16.3% 17.5%",
      "--ring": "262.1 83.3% 57.8%",
    },
  },
  {
    name: "Orange",
    colors: {
      primary: "24 94% 50%", // vibrant orange
      secondary: "24 80% 92%",
      accent: "24 80% 92%",
      background: "0 0% 100%",
      foreground: "24 100% 6%",
      muted: "24 80% 92%",
      border: "24 60% 86%",
    },
    cssVariables: {
      "--primary": "24 94% 50%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "24 80% 92%",
      "--secondary-foreground": "24 100% 10%",
      "--accent": "24 80% 92%",
      "--accent-foreground": "24 100% 10%",
      "--background": "0 0% 100%",
      "--foreground": "24 100% 6%",
      "--muted": "24 80% 92%",
      "--muted-foreground": "24 20% 45%",
      "--border": "24 60% 86%",
      "--input": "24 60% 86%",
      "--ring": "24 94% 50%",
    },
    darkCssVariables: {
      "--primary": "24 94% 60%", // slightly brighter for contrast on dark
      "--primary-foreground": "0 0% 100%",
      "--secondary": "24 30% 15%",
      "--secondary-foreground": "24 90% 96%",
      "--accent": "24 30% 15%",
      "--accent-foreground": "24 90% 96%",
      "--background": "24 100% 6%",
      "--foreground": "24 90% 96%",
      "--muted": "24 30% 15%",
      "--muted-foreground": "24 20% 70%",
      "--border": "24 30% 15%",
      "--input": "24 30% 15%",
      "--ring": "24 94% 50%",
    },
  }
  ,
  {
    name: "Pink",
    colors: {
      primary: "336 80% 58%",
      secondary: "336 40% 96%",
      accent: "336 40% 96%",
      background: "0 0% 100%",
      foreground: "336 60% 10%",
      muted: "336 40% 96%",
      border: "336 30% 90%",
    },
    cssVariables: {
      "--primary": "336 80% 58%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "336 40% 96%",
      "--secondary-foreground": "336 80% 58%",
      "--accent": "336 40% 96%",
      "--accent-foreground": "336 80% 58%",
      "--background": "0 0% 100%",
      "--foreground": "336 60% 10%",
      "--muted": "336 40% 96%",
      "--muted-foreground": "336 30% 50%",
      "--border": "336 30% 90%",
      "--input": "336 30% 90%",
      "--ring": "336 80% 58%",
    },
    darkCssVariables: {
      "--primary": "336 73.7% 53.1%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "336 30% 15.9%",
      "--secondary-foreground": "336 40% 96%",
      "--accent": "336 30% 15.9%",
      "--accent-foreground": "336 40% 96%",
      "--background": "336 60% 10%",
      "--foreground": "336 40% 96%",
      "--muted": "336 30% 15.9%",
      "--muted-foreground": "336 30% 70%",
      "--border": "336 30% 15.9%",
      "--input": "336 30% 15.9%",
      "--ring": "336 80% 58%",
    },
  },
  {
    name: "Teal",
    colors: {
      primary: "180 100% 30%",
      secondary: "180 60% 96%",
      accent: "180 60% 96%",
      background: "0 0% 100%",
      foreground: "180 80% 10%",
      muted: "180 60% 96%",
      border: "180 30% 90%",
    },
    cssVariables: {
      "--primary": "180 100% 30%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "180 60% 96%",
      "--secondary-foreground": "180 100% 30%",
      "--accent": "180 60% 96%",
      "--accent-foreground": "180 100% 30%",
      "--background": "0 0% 100%",
      "--foreground": "180 80% 10%",
      "--muted": "180 60% 96%",
      "--muted-foreground": "180 30% 50%",
      "--border": "180 30% 90%",
      "--input": "180 30% 90%",
      "--ring": "180 100% 30%",
    },
    darkCssVariables: {
      "--primary": "180 100% 40%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "180 30% 15.9%",
      "--secondary-foreground": "180 60% 96%",
      "--accent": "180 30% 15.9%",
      "--accent-foreground": "180 60% 96%",
      "--background": "180 80% 10%",
      "--foreground": "180 60% 96%",
      "--muted": "180 30% 15.9%",
      "--muted-foreground": "180 30% 70%",
      "--border": "180 30% 15.9%",
      "--input": "180 30% 15.9%",
      "--ring": "180 100% 30%",
    },
  },
  {
    name: "Red",
    colors: {
      primary: "0 100% 50%",
      secondary: "0 60% 96%",
      accent: "0 60% 96%",
      background: "0 0% 100%",
      foreground: "0 80% 10%",
      muted: "0 60% 96%",
      border: "0 30% 90%",
    },
    cssVariables: {
      "--primary": "0 100% 50%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "0 60% 96%",
      "--secondary-foreground": "0 100% 50%",
      "--accent": "0 60% 96%",
      "--accent-foreground": "0 100% 50%",
      "--background": "0 0% 100%",
      "--foreground": "0 80% 10%",
      "--muted": "0 60% 96%",
      "--muted-foreground": "0 30% 50%",
      "--border": "0 30% 90%",
      "--input": "0 30% 90%",
      "--ring": "0 100% 50%",
    },
    darkCssVariables: {
      "--primary": "0 100% 60%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "0 30% 15.9%",
      "--secondary-foreground": "0 60% 96%",
      "--accent": "0 30% 15.9%",
      "--accent-foreground": "0 60% 96%",
      "--background": "0 80% 10%",
      "--foreground": "0 60% 96%",
      "--muted": "0 30% 15.9%",
      "--muted-foreground": "0 30% 70%",
      "--border": "0 30% 15.9%",
      "--input": "0 30% 15.9%",
      "--ring": "0 100% 50%",
    },
  },
  // New Cyan Theme
  {
    name: "Cyan",
    colors: {
      primary: "190 95% 39%",
      secondary: "190 60% 96%",
      accent: "190 60% 96%",
      background: "0 0% 100%",
      foreground: "190 80% 10%",
      muted: "190 60% 96%",
      border: "190 30% 90%",
    },
    cssVariables: {
      "--primary": "190 95% 39%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "190 60% 96%",
      "--secondary-foreground": "190 95% 39%",
      "--accent": "190 60% 96%",
      "--accent-foreground": "190 95% 39%",
      "--background": "0 0% 100%",
      "--foreground": "190 80% 10%",
      "--muted": "190 60% 96%",
      "--muted-foreground": "190 30% 50%",
      "--border": "190 30% 90%",
      "--input": "190 30% 90%",
      "--ring": "190 95% 39%",
    },
    darkCssVariables: {
      "--primary": "190 95% 50%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "190 30% 15.9%",
      "--secondary-foreground": "190 60% 96%",
      "--accent": "190 30% 15.9%",
      "--accent-foreground": "190 60% 96%",
      "--background": "190 80% 10%",
      "--foreground": "190 60% 96%",
      "--muted": "190 30% 15.9%",
      "--muted-foreground": "190 30% 70%",
      "--border": "190 30% 15.9%",
      "--input": "190 30% 15.9%",
      "--ring": "190 95% 39%",
    },
  },
  // New Indigo Theme
  {
    name: "Indigo",
    colors: {
      primary: "245 70% 50%",
      secondary: "245 60% 96%",
      accent: "245 60% 96%",
      background: "0 0% 100%",
      foreground: "245 80% 10%",
      muted: "245 60% 96%",
      border: "245 30% 90%",
    },
    cssVariables: {
      "--primary": "245 70% 50%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "245 60% 96%",
      "--secondary-foreground": "245 70% 50%",
      "--accent": "245 60% 96%",
      "--accent-foreground": "245 70% 50%",
      "--background": "0 0% 100%",
      "--foreground": "245 80% 10%",
      "--muted": "245 60% 96%",
      "--muted-foreground": "245 30% 50%",
      "--border": "245 30% 90%",
      "--input": "245 30% 90%",
      "--ring": "245 70% 50%",
    },
    darkCssVariables: {
      "--primary": "245 70% 60%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "245 30% 15.9%",
      "--secondary-foreground": "245 60% 96%",
      "--accent": "245 30% 15.9%",
      "--accent-foreground": "245 60% 96%",
      "--background": "245 80% 10%",
      "--foreground": "245 60% 96%",
      "--muted": "245 30% 15.9%",
      "--muted-foreground": "245 30% 70%",
      "--border": "245 30% 15.9%",
      "--input": "245 30% 15.9%",
      "--ring": "245 70% 50%",
    },
  },
  // New Amber Theme
  {
    name: "Amber",
    colors: {
      primary: "45 93% 47%",
      secondary: "45 60% 96%",
      accent: "45 60% 96%",
      background: "0 0% 100%",
      foreground: "45 80% 10%",
      muted: "45 60% 96%",
      border: "45 30% 90%",
    },
    cssVariables: {
      "--primary": "45 93% 47%",
      "--primary-foreground": "0 0% 10%", // Dark text on light amber for better contrast
      "--secondary": "45 60% 96%",
      "--secondary-foreground": "45 93% 30%",
      "--accent": "45 60% 96%",
      "--accent-foreground": "45 93% 30%",
      "--background": "0 0% 100%",
      "--foreground": "45 80% 10%",
      "--muted": "45 60% 96%",
      "--muted-foreground": "45 30% 50%",
      "--border": "45 30% 90%",
      "--input": "45 30% 90%",
      "--ring": "45 93% 47%",
    },
    darkCssVariables: {
      "--primary": "45 93% 55%",
      "--primary-foreground": "0 0% 10%", // Dark text on light amber for better contrast
      "--secondary": "45 30% 15.9%",
      "--secondary-foreground": "45 60% 96%",
      "--accent": "45 30% 15.9%",
      "--accent-foreground": "45 60% 96%",
      "--background": "45 80% 10%",
      "--foreground": "45 60% 96%",
      "--muted": "45 30% 15.9%",
      "--muted-foreground": "45 30% 70%",
      "--border": "45 30% 15.9%",
      "--input": "45 30% 15.9%",
      "--ring": "45 93% 47%",
    },
  },
  // New Lime Theme
  {
    name: "Lime",
    colors: {
      primary: "85 80% 40%",
      secondary: "85 60% 96%",
      accent: "85 60% 96%",
      background: "0 0% 100%",
      foreground: "85 80% 10%",
      muted: "85 60% 96%",
      border: "85 30% 90%",
    },
    cssVariables: {
      "--primary": "85 80% 40%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "85 60% 96%",
      "--secondary-foreground": "85 80% 25%",
      "--accent": "85 60% 96%",
      "--accent-foreground": "85 80% 25%",
      "--background": "0 0% 100%",
      "--foreground": "85 80% 10%",
      "--muted": "85 60% 96%",
      "--muted-foreground": "85 30% 50%",
      "--border": "85 30% 90%",
      "--input": "85 30% 90%",
      "--ring": "85 80% 40%",
    },
    darkCssVariables: {
      "--primary": "85 80% 50%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "85 30% 15.9%",
      "--secondary-foreground": "85 60% 96%",
      "--accent": "85 30% 15.9%",
      "--accent-foreground": "85 60% 96%",
      "--background": "85 80% 5%",
      "--foreground": "85 60% 96%",
      "--muted": "85 30% 15.9%",
      "--muted-foreground": "85 30% 70%",
      "--border": "85 30% 15.9%",
      "--input": "85 30% 15.9%",
      "--ring": "85 80% 40%",
    },
  },
]

// Font options
export const fonts: FontOption[] = [
  {
    name: "Default (System UI)",
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    cssVariable: "--font-sans",
  },
  {
    name: "Inter",
    fontFamily: "'Inter', sans-serif",
    cssVariable: "--font-sans",
  },
  {
    name: "Roboto",
    fontFamily: "'Roboto', sans-serif",
    cssVariable: "--font-sans",
  },
  {
    name: "Poppins",
    fontFamily: "'Poppins', sans-serif",
    cssVariable: "--font-sans",
  },
  {
    name: "Montserrat",
    fontFamily: "'Montserrat', sans-serif",
    cssVariable: "--font-sans",
  },
  {
    name: "Open Sans",
    fontFamily: "'Open Sans', sans-serif",
    cssVariable: "--font-sans",
  },
]

// Apply theme to document
export function applyTheme(theme: ThemeOption): void {
  const root = document.documentElement
  const isDark = document.documentElement.classList.contains("dark")

  // Save the current color mode to localStorage


  // Save the current theme name to localStorage
  localStorage.setItem("selectedThemeName", theme.name)

  // First, apply base variables from the theme
  const baseVariables = theme.cssVariables
  Object.entries(baseVariables).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })

  // Then apply dark mode variables if in dark mode
  if (isDark && theme.darkCssVariables) {
    const darkVariables = theme.darkCssVariables
    Object.entries(darkVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
  }

  // Apply chart colors based on the theme and mode
  if (isDark) {
    root.style.setProperty("--chart-1", "220 70% 50%")
    root.style.setProperty("--chart-2", "160 60% 45%")
    root.style.setProperty("--chart-3", "30 80% 55%")
    root.style.setProperty("--chart-4", "280 65% 60%")
    root.style.setProperty("--chart-5", "340 75% 55%")

    // Apply sidebar colors for dark mode
    root.style.setProperty("--sidebar-background", "240 5.9% 10%")
    root.style.setProperty("--sidebar-foreground", "240 4.8% 95.9%")
    root.style.setProperty("--sidebar-primary", "224.3 76.3% 48%")
    root.style.setProperty("--sidebar-primary-foreground", "0 0% 100%")
    root.style.setProperty("--sidebar-accent", "240 3.7% 15.9%")
    root.style.setProperty("--sidebar-accent-foreground", "240 4.8% 95.9%")
    root.style.setProperty("--sidebar-border", "240 4.8% 95.9%")
    root.style.setProperty("--sidebar-border", "240 3.7% 15.9%")
    root.style.setProperty("--sidebar-ring", "217.2 91.2% 59.8%")
  } else {
    root.style.setProperty("--chart-1", "12 76% 61%")
    root.style.setProperty("--chart-2", "173 58% 39%")
    root.style.setProperty("--chart-3", "197 37% 24%")
    root.style.setProperty("--chart-4", "43 74% 66%")
    root.style.setProperty("--chart-5", "27 87% 67%")

    // Apply sidebar colors for light mode
    root.style.setProperty("--sidebar-background", "0 0% 98%")
    root.style.setProperty("--sidebar-foreground", "240 5.3% 26.1%")
    root.style.setProperty("--sidebar-primary", "240 5.9% 10%")
    root.style.setProperty("--sidebar-primary-foreground", "0 0% 98%")
    root.style.setProperty("--sidebar-accent", "240 4.8% 95.9%")
    root.style.setProperty("--sidebar-accent-foreground", "240 5.9% 10%")
    root.style.setProperty("--sidebar-border", "220 13% 91%")
    root.style.setProperty("--sidebar-ring", "217.2 91.2% 59.8%")
  }
}

// Apply font to document
export function applyFont(font: FontOption): void {
  const root = document.documentElement
  document.body.style.fontFamily = font.fontFamily
  root.style.setProperty(font.cssVariable, font.fontFamily)

  // Save the current font name to localStorage
  localStorage.setItem("selectedFontName", font.name)
}
