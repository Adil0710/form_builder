"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { MoonIcon, SunIcon, ExternalLink, Trash2, X } from "lucide-react";

import { useFormBuilderStore } from "@/lib/store";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

import { FieldsPanel } from "./fields-panel";
import { FormPreview } from "./form-preview";
import { PropertiesPanel } from "./properties-panel";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { PreviewPanel } from "./preview-panel";

export function FormBuilder() {
  const { toast } = useToast();
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const {
    activeId,
    setActiveId,
    addFormElement,
    formTabs,
    formElements,
    formTitle,
    formDescription,
    setFormTitle,
    setFormDescription,
    useTabs,
    setUseTabs,
    saveForm,
    loadForm,
    clearForm,
    activeTabId,
    addFormTab,
  } = useFormBuilderStore();

  const [showFormSettings, setShowFormSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

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
    })
  );

  useEffect(() => {
    // Load form from localStorage on initial load
    const savedForm = localStorage.getItem("savedForm");
    if (savedForm) {
      try {
        const parsedForm = JSON.parse(savedForm);
        loadForm(parsedForm);
      } catch (error) {
        console.error("Failed to load saved form:", error);
      }
    } else {
      // Create a default tab if none exists
      if (!useTabs && formElements.length === 0) {
        // Do nothing, let user decide
      } else if (useTabs && formTabs.length === 0) {
        addFormTab("Tab 1");
      }
    }
  }, []); // Empty dependency array to run only once

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveId(active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    // Check if dropping a new element from the sidebar
    if (active.id.toString().startsWith("new-")) {
      const type = active.id.toString().replace("new-", "");

      if (!useTabs) {
        // Add to single-page form
        addFormElement(type, null);
      } else {
        // Check if dropping into a tab
        if (over.id.toString().startsWith("tab-droppable-")) {
          const tabId = over.id.toString().replace("tab-droppable-", "");
          addFormElement(type, tabId);
        } else if (activeTabId) {
          // Add to the active tab
          addFormElement(type, activeTabId);
        } else if (formTabs.length > 0) {
          // Add to the first tab if no active tab
          addFormElement(type, formTabs[0].id);
        } else {
          // Create a new tab and add the element
          addFormTab();
          // The element will be added in the next render cycle
        }
      }
    }

    setActiveId(null);
  }

  const handleSaveForm = () => {
    if (useTabs && formTabs.length === 0) {
      toast({
        title: "No tabs",
        description:
          "Please create at least one tab or switch to single-page mode.",
        variant: "destructive",
      });
      return;
    }

    if (!useTabs && formElements.length === 0 && formTabs.length === 0) {
      toast({
        title: "Empty Form",
        description: "Please add some fields to your form before saving.",
        variant: "destructive",
      });
      return;
    }

    const formData = saveForm();
    localStorage.setItem("savedForm", JSON.stringify(formData));

    toast({
      title: "Form saved",
      description: "Your form has been saved successfully.",
    });

    console.log("Form JSON:", JSON.stringify(formData, null, 2));
  };

  const handleClearForm = () => {
    clearForm();
    toast({
      title: "Form cleared",
      description: "Your form has been cleared successfully.",
    });
  };

  const handlePreviewForm = () => {
    if (
      (useTabs && formTabs.every((tab) => tab.elements.length === 0)) ||
      (!useTabs && formElements.length === 0)
    ) {
      toast({
        title: "Empty Form",
        description: "Please add some fields to your form before previewing.",
        variant: "destructive",
      });
      return;
    }

    // Save the form first
    handleSaveForm();

    // Navigate to the form renderer page
    router.push(`/form-renderer`);
  };

  const handleToggleTabs = (checked: boolean) => {
    if (checked && formTabs.length === 0) {
      // If switching to tabs mode and no tabs exist, create one
      addFormTab("Tab 1");
    }
    setUseTabs(checked);
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b">
        <div className="w-full flex items-center justify-between h-16 px-16">
          <h1 className="text-xl font-bold">Form Builder</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFormSettings(!showFormSettings)}
            >
              Form Settings
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <SunIcon className="h-4 w-4" />
              ) : (
                <MoonIcon className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button variant="outline" onClick={handlePreviewForm}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Preview Form
            </Button>
            <Button onClick={handleSaveForm}>Save Form</Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Clear Form</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear Form</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to clear the &quot;
                    {formTitle}&quot; form? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearForm} className="bg-red-500 hover:bg-red-400">
                   Clear
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {showFormSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: settingsRef.current
                ? settingsRef.current.scrollHeight
                : "auto",
            }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-b"
          >
            <div ref={settingsRef} className="py-4 -ml-16">
              <div className="max-w-2xl mx-auto relative grid gap-4">
                <X
                  className="absolute top-4 right-0 cursor-pointer"
                  onClick={() => setShowFormSettings(false)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="form-title">Form Title</Label>
                    <Input
                      id="form-title"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="Enter form title"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="use-tabs"
                      checked={useTabs}
                      onCheckedChange={handleToggleTabs}
                    />
                    <Label htmlFor="use-tabs">Use Tabs</Label>
                  </div>
                </div>
                <div>
                  <Label htmlFor="form-description">Form Description</Label>
                  <Textarea
                    id="form-description"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Enter form description"
                    rows={2}
                    className="resize-none"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
          <Separator orientation="vertical" />
          <PreviewPanel/>
          <DragOverlay>
            {activeId && activeId.toString().startsWith("new-") && (
              <div className="bg-background border rounded-md p-4 shadow-md w-64">
                {activeId.toString().replace("new-", "").replace("_", " ")} Field
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
      <Toaster />
    </div>
  );
}
