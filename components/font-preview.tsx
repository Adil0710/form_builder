"use client"

import { FontOption } from "./theme-preview"



interface FontPreviewProps {
  font: FontOption
  selected: boolean
  onClick: () => void
}

export function FontPreview({ font, selected, onClick }: FontPreviewProps) {
  return (
    <div
      className={`relative p-2 border rounded-md cursor-pointer transition-all ${
        selected ? "ring-2 ring-primary" : "hover:border-primary/50"
      }`}
      onClick={onClick}
      style={{ fontFamily: font.fontFamily }}
    >
      <div className="text-sm font-medium">{font.name}</div>
      <div className="text-xs text-muted-foreground">The quick brown fox jumps over the lazy dog</div>
      {selected && <div className="absolute top-1 right-1 w-3 h-3 bg-primary rounded-full" />}
    </div>
  )
}
