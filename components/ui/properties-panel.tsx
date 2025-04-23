"use client"

import type React from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PropertiesPanelProps {
  selectedElement: any
  updateElementProperty: (id: string, property: string, value: any) => void
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedElement, updateElementProperty }) => {
  if (!selectedElement) {
    return <div className="p-4">Select an element to view properties.</div>
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Properties</h3>

      {selectedElement.type === "text" && (
        <div className="space-y-2">
          <Label htmlFor="text">Text</Label>
          <Textarea
            id="text"
            placeholder="Enter text"
            value={selectedElement.properties.text || ""}
            onChange={(e) => updateElementProperty(selectedElement.id, "text", e.target.value)}
          />
        </div>
      )}

      {selectedElement.type === "image" && (
        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            type="text"
            id="imageUrl"
            placeholder="Enter image URL"
            value={selectedElement.properties.src || ""}
            onChange={(e) => updateElementProperty(selectedElement.id, "src", e.target.value)}
          />
        </div>
      )}

      {selectedElement.type === "button" && (
        <div className="space-y-2">
          <Label htmlFor="buttonText">Button Text</Label>
          <Input
            type="text"
            id="buttonText"
            placeholder="Enter button text"
            value={selectedElement.properties.text || ""}
            onChange={(e) => updateElementProperty(selectedElement.id, "text", e.target.value)}
          />
        </div>
      )}

      {selectedElement.type === "header" && (
        <div className="space-y-2">
          <Label htmlFor="headerText">Header Text</Label>
          <Textarea
            id="headerText"
            placeholder="Enter header text"
            value={selectedElement.properties.text || ""}
            onChange={(e) => updateElementProperty(selectedElement.id, "text", e.target.value)}
          />
        </div>
      )}

      {selectedElement.type === "header" && (
        <div className="space-y-2">
          <Label htmlFor="headerSize">Header Size</Label>
          <Select
            value={selectedElement.properties.size || "1"}
            onValueChange={(value) => updateElementProperty(selectedElement.id, "size", value)}
          >
            <SelectTrigger id="headerSize">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Size 1 (Largest)</SelectItem>
              <SelectItem value="2">Size 2</SelectItem>
              <SelectItem value="3">Size 3</SelectItem>
              <SelectItem value="4">Size 4</SelectItem>
              <SelectItem value="5">Size 5 (Smallest)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}

export default PropertiesPanel
