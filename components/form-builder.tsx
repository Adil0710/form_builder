"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { restrictToWindowEdges } from "@dnd-kit/modifiers"
import { MoonIcon, SunIcon, ExternalLink } from "lucide-react"

import { useFormBuilderStore } from "@/lib/store"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

import { FieldsPanel } from "./fields-panel"
import { FormPreview } from "./form-preview"
import { PropertiesPanel } from "./properties-panel"

export function FormBuilder() {
  const { toast } = useToast()
  const router = useRouter()
  const { setTheme, theme } = useTheme()
  const { activeId, setActiveId, addFormElement, formTabs, setFormTabs, saveForm, loadForm, activeTabId, addFormTab } =
    useFormBuilderStore()

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
  )

  useEffect(() => {
    // Load form from localStorage on initial load
    const savedForm = localStorage.getItem("savedForm")
    if (savedForm) {
      try {
        loadForm(JSON.parse(savedForm))
      } catch (error) {
        console.error("Failed to load saved form:", error)
      }
    } else {
      // Create a default tab if none exists
      addFormTab("Tab 1")
    }
  }, [loadForm, addFormTab])

  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    setActiveId(active.id as string)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over) {
      setActiveId(null)
      return
    }

    // Check if dropping a new element from the sidebar
    if (active.id.toString().startsWith("new-")) {
      const type = active.id.toString().replace("new-", "")

      // Check if dropping into a tab
      if (over.id.toString().startsWith("tab-droppable-")) {
        const tabId = over.id.toString().replace("tab-droppable-", "")
        addFormElement(type, tabId)
      } else if (activeTabId) {
        // Add to the active tab
        addFormElement(type, activeTabId)
      } else if (formTabs.length > 0) {
        // Add to the first tab if no active tab
        addFormElement(type, formTabs[0].id)
      } else {
        // Create a new tab and add the element
        addFormTab()
        // The element will be added in the next render cycle
      }
    }

    setActiveId(null)
  }

  const handleSaveForm = () => {
    if (formTabs.length === 0) {
      toast({
        title: "No tabs",
        description: "Please create at least one tab before saving.",
        variant: "destructive",
      })
      return
    }

    const formData = saveForm()
    localStorage.setItem("savedForm", JSON.stringify(formData))

    toast({
      title: "Form saved",
      description: "Your form has been saved successfully.",
    })

    console.log("Form JSON:", JSON.stringify(formData, null, 2))
    console.log("Form JSON:", formData)
  }

  const handlePreviewForm = () => {
    if (formTabs.length === 0 || formTabs.every((tab) => tab.elements.length === 0)) {
      toast({
        title: "Empty Form",
        description: "Please add some fields to your form before previewing.",
        variant: "destructive",
      })
      return
    }

    // Save the form first
    handleSaveForm()

    // Navigate to the form renderer page
    router.push(`/form-renderer`)
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16 pl-16">
          <h1 className="text-xl font-bold">Form Builder</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button variant="outline" onClick={handlePreviewForm}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Preview Form
            </Button>
            <Button onClick={handleSaveForm}>Save Form</Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToWindowEdges]}
        >
          <FieldsPanel />
          <Separator orientation="vertical" />
          <FormPreview />
          <Separator orientation="vertical" />
          <PropertiesPanel />
          <DragOverlay>
            {activeId && activeId.toString().startsWith("new-") && (
              <div className="bg-background border rounded-md p-4 shadow-md w-64">
                {activeId.toString().replace("new-", "")} Field
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
      <Toaster />
    </div>
  )
}
