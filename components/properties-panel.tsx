"use client"

import { useState } from "react"
import { PlusCircle, Smartphone, X } from "lucide-react"

import { useFormBuilderStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

import { MobilePreview } from "./mobile-preview"

export function PropertiesPanel() {
  const { updateElementProperty } = useFormBuilderStore()
  const [newOption, setNewOption] = useState("")
  const [activeTab, setActiveTab] = useState("properties")

  // Find the selected element using a more stable approach
  const selectedElementId = useFormBuilderStore((state) => state.selectedElementId)
  const findElementById = useFormBuilderStore((state) => state.findElementById)

  // Only call findElementById when we have a selectedElementId
  const selectedElementResult = selectedElementId ? findElementById(selectedElementId) : { element: null, tabId: null }
  const selectedElement = selectedElementResult.element

  if (!selectedElement) {
    return (
      <div className="w-80 border-l bg-muted/20">
        <div className="p-4 font-medium">Properties</div>
        <Separator />
        <Tabs defaultValue="properties" className="w-full">
          <TabsList className="grid grid-cols-2 mx-4 mt-2">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="properties" className="p-4">
            <div className="text-sm text-muted-foreground">Select an element to edit its properties</div>
          </TabsContent>
          <TabsContent value="preview" className="p-4">
            <MobilePreview />
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  const handleAddOption = () => {
    if (!newOption.trim()) return

    const currentOptions = selectedElement.properties.options || []
    updateElementProperty(selectedElement.id, "options", [...currentOptions, newOption])
    setNewOption("")
  }

  const handleRemoveOption = (index: number) => {
    const currentOptions = [...(selectedElement.properties.options || [])]
    currentOptions.splice(index, 1)
    updateElementProperty(selectedElement.id, "options", currentOptions)
  }

  return (
    <div className="w-80 border-l bg-muted/20">
      <div className="p-4 font-medium">Properties</div>
      <Separator />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mx-4 mt-2">
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="preview">
            <Smartphone className="h-4 w-4 mr-2" />
            Preview
          </TabsTrigger>
        </TabsList>
        <TabsContent value="properties" className="p-0">
          <ScrollArea className="h-[calc(100vh-10rem)]">
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  value={selectedElement.properties.label || ""}
                  onChange={(e) => updateElementProperty(selectedElement.id, "label", e.target.value)}
                  placeholder="Enter label"
                />
              </div>

              {(selectedElement.type === "input" ||
                selectedElement.type === "textarea" ||
                selectedElement.type === "select" ||
                selectedElement.type === "date" ||
                selectedElement.type === "phone" ||
                selectedElement.type === "url") && (
                <div className="space-y-2">
                  <Label htmlFor="placeholder">Placeholder</Label>
                  <Input
                    id="placeholder"
                    value={selectedElement.properties.placeholder || ""}
                    onChange={(e) => updateElementProperty(selectedElement.id, "placeholder", e.target.value)}
                    placeholder="Enter placeholder"
                  />
                </div>
              )}

              {selectedElement.type.startsWith("header") && (
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={selectedElement.properties.description || ""}
                    onChange={(e) => updateElementProperty(selectedElement.id, "description", e.target.value)}
                    placeholder="Enter description"
                    className=" resize-none"
                    rows={5}
                  />
                </div>
              )}

              {selectedElement.type !== "header" && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="required"
                    checked={selectedElement.properties.required || false}
                    onCheckedChange={(checked) => updateElementProperty(selectedElement.id, "required", !!checked)}
                  />
                  <Label htmlFor="required">Required</Label>
                </div>
              )}

              {(selectedElement.type === "select" ||
                selectedElement.type === "radio" ||
                selectedElement.type === "checkbox") && (
                <div className="space-y-2">
                  <Label>Options</Label>
                  <div className="space-y-2">
                    {(selectedElement.properties.options || []).map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...(selectedElement.properties.options || [])]
                            newOptions[index] = e.target.value
                            updateElementProperty(selectedElement.id, "options", newOptions)
                          }}
                        />
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveOption(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <Input
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        placeholder="Add option"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddOption()
                          }
                        }}
                      />
                      <Button variant="ghost" size="icon" onClick={handleAddOption}>
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="preview" className="p-4 flex justify-center">
          <MobilePreview />
        </TabsContent>
      </Tabs>
    </div>
  )
}
