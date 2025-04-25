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
  
  export function applyTheme(theme: ThemeOption): void {
    const root = document.documentElement
    const isDark = document.documentElement.classList.contains("dark")
  
    // Apply the appropriate CSS variables based on light/dark mode
    const variables = !isDark && theme.darkCssVariables ? theme.darkCssVariables : theme.cssVariables
  
    // Apply all CSS variables from the theme
    Object.entries(variables).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
  
    // Apply chart colors in both light and dark modes
    if (isDark && theme.darkCssVariables) {
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
      root.style.setProperty("--sidebar-border", "240 3.7% 15.9%")
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
    }
  }
  