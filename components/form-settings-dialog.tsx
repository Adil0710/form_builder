"use client"
import { Columns3, Palette, Type, Settings } from "lucide-react"
import { useTheme } from "next-themes"
import { useFormBuilderStore } from "@/lib/store"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { applyFont, applyTheme, fonts, themes } from "./theme-preview"
import { useEffect } from "react"

export function FormSettingsDialog() {
  const { useTabs, setUseTabs, selectedTheme, selectedFont, setSelectedTheme, setSelectedFont, addFormTab, formTabs } =
    useFormBuilderStore()
  const { theme, setTheme } = useTheme()

  // Load saved theme and color mode on mount
  useEffect(() => {
    const savedColorMode = localStorage.getItem("colorMode")
    if (savedColorMode) {
      setTheme(savedColorMode)
    }

    const savedThemeName = localStorage.getItem("selectedThemeName")
    if (savedThemeName) {
      const foundTheme = themes.find((t) => t.name === savedThemeName)
      if (foundTheme) {
        setSelectedTheme(foundTheme)
      }
    }

    const savedFontName = localStorage.getItem("selectedFontName")
    if (savedFontName) {
      const foundFont = fonts.find((f) => f.name === savedFontName)
      if (foundFont) {
        setSelectedFont(foundFont)
      }
    }
  }, [setTheme, setSelectedTheme, setSelectedFont])

  const handleToggleTabs = (checked: boolean) => {
    if (checked && formTabs.length === 0) {
      // If switching to tabs mode and no tabs exist, create one
      addFormTab("Tab 1")
    }
    setUseTabs(checked)
  }

  const handleThemeSelect = (themeOption: (typeof themes)[0]) => {
    setSelectedTheme(themeOption)
    applyTheme(themeOption)
 
  }

  const handleFontSelect = (fontOption: (typeof fonts)[0]) => {
    setSelectedFont(fontOption)
    applyFont(fontOption)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Form Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Form Settings</DialogTitle>
          <DialogDescription>Customize your form appearance and behavior</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="layout">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="layout">
              <Columns3 className="w-4 h-4 mr-2" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="theme">
              <Palette className="w-4 h-4 mr-2" />
              Theme
            </TabsTrigger>
            <TabsTrigger value="typography">
              <Type className="w-4 h-4 mr-2" />
              Typography
            </TabsTrigger>
          </TabsList>

          <TabsContent value="layout" className="space-y-4 py-4">
            <div className="flex items-center space-x-4 rounded-md border p-4">
              <Columns3 />
              <div className="flex-1 space-y-1">
                <Label htmlFor="use-tabs" className="text-sm font-medium leading-none">
                  Use Tabs / Sections
                </Label>
                <p className="text-sm text-muted-foreground">Create multiple tabs or sections for your form.</p>
              </div>
              <Switch id="use-tabs" checked={useTabs} onCheckedChange={handleToggleTabs} />
            </div>
          </TabsContent>

          <TabsContent value="theme" className="py-4">
            <div className="space-y-4">
              <Label className="text-sm font-medium">Select Theme</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {themes.map((themeOption) => (
                  <div
                    key={themeOption.name}
                    className={`relative flex flex-col gap-2 p-2 border rounded-md cursor-pointer transition-all ${
                      selectedTheme.name === themeOption.name ? "ring-2 ring-primary" : "hover:border-primary/50"
                    }`}
                    onClick={() => handleThemeSelect(themeOption)}
                  >
                    <div className="text-sm font-medium">{themeOption.name}</div>
                    <div className="flex gap-1">
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: `hsl(${themeOption.colors.primary})` }}
                      />
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: `hsl(${themeOption.colors.secondary})` }}
                      />
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: `hsl(${themeOption.colors.accent})` }}
                      />
                    </div>
                    {selectedTheme.name === themeOption.name && (
                      <div className="absolute top-1 right-1 w-3 h-3 bg-primary rounded-full" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="typography" className="py-4">
            <div className="space-y-4">
              <Label className="text-sm font-medium">Select Font</Label>
              <div className="grid grid-cols-2 gap-4">
                {fonts.map((fontOption) => (
                  <div
                    key={fontOption.name}
                    className={`relative p-2 border rounded-md cursor-pointer transition-all ${
                      selectedFont.name === fontOption.name ? "ring-2 ring-primary" : "hover:border-primary/50"
                    }`}
                    onClick={() => handleFontSelect(fontOption)}
                    style={{ fontFamily: fontOption.fontFamily }}
                  >
                    <div className="text-sm font-medium">{fontOption.name}</div>
                    <div className="text-xs text-muted-foreground">The quick brown fox jumps over the lazy dog</div>
                    {selectedFont.name === fontOption.name && (
                      <div className="absolute top-1 right-1 w-3 h-3 bg-primary rounded-full" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary" size="sm">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
