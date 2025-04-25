"use client";

import type React from "react";

import { useRef, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  CalendarIcon,
  GripVertical,
  Trash2,
  Plus,
  X,
  Edit,
} from "lucide-react";
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
import type { FormElement, FormTab } from "@/lib/types";
import { useFormBuilderStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { SignaturePad } from "./signature-pad";

function FormElementPreview({ element }: { element: FormElement }) {
  const { selectElement, removeElement, selectedElementId } =
    useFormBuilderStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: element.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isSelected = selectedElementId === element.id;

  const renderFormElement = () => {
    switch (element.type) {
      case "input":
        return (
          <div className="space-y-2">
            <Label htmlFor={element.id}>
              {element.properties.label || "Text Input"}
            </Label>
            <Input
              id={element.id}
              placeholder={element.properties.placeholder || "Enter text"}
              disabled
              className="w-[90%]"
            />
          </div>
        );
      case "textarea":
        return (
          <div className="space-y-2">
            <Label htmlFor={element.id}>
              {element.properties.label || "Text Area"}
            </Label>
            <Textarea
              id={element.id}
              placeholder={element.properties.placeholder || "Enter text"}
              disabled
              className="w-[90%] resize-none"
            />
          </div>
        );
      case "checkbox":
        return (
          <div className="space-y-2">
            <Label>{element.properties.label || "Checkbox Group"}</Label>
            <div className="space-y-2">
              {(element.properties.options || ["Option 1", "Option 2"]).map(
                (option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${element.id}-${index}`}
                      disabled
                    />
                    <Label htmlFor={`${element.id}-${index}`}>{option}</Label>
                  </div>
                )
              )}
            </div>
          </div>
        );
      case "select":
        return (
          <div className="space-y-2 flex flex-col">
            <Label htmlFor={element.id}>
              {element.properties.label || "Select"}
            </Label>
            <select
              id={element.id}
              className="w-[90%] p-2 border rounded-md bg-background"
              disabled
            >
              <option>
                {element.properties.placeholder || "Select an option"}
              </option>
              {element.properties.options?.map((option, index) => (
                <option key={index}>{option}</option>
              ))}
            </select>
          </div>
        );
      case "radio":
        return (
          <div className="space-y-2">
            <Label>{element.properties.label || "Radio Group"}</Label>
            <div className="space-y-2">
              {(element.properties.options || ["Option 1", "Option 2"]).map(
                (option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`${element.id}-${index}`}
                      name={element.id}
                      disabled
                      className="accent-black dark:accent-white"
                    />
                    <Label htmlFor={`${element.id}-${index}`}>{option}</Label>
                  </div>
                )
              )}
            </div>
          </div>
        );
      case "date":
        return (
          <div className="space-y-2">
            <Label htmlFor={element.id}>
              {element.properties.label || "Date Picker"}
            </Label>
            <div className="relative w-[90%]">
              <Input
                id={element.id}
                placeholder={element.properties.placeholder || "Select date"}
                disabled
              />
              <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
            </div>
          </div>
        );
      case "phone":
        return (
          <div className="space-y-2">
            <Label htmlFor={element.id}>
              {element.properties.label || "Phone Number"}
            </Label>
            <Input
              id={element.id}
              type="tel"
              placeholder={
                element.properties.placeholder || "Enter phone number"
              }
              disabled
              className="w-[90%]"
            />
          </div>
        );
      case "email":
        return (
          <div className="space-y-2">
            <Label htmlFor={element.id}>
              {element.properties.label || "Email Id"}
            </Label>
            <Input
              id={element.id}
              type="email"
              placeholder={element.properties.placeholder || "Enter email id"}
              disabled
              className="w-[90%]"
            />
          </div>
        );
      case "url":
        return (
          <div className="space-y-2">
            <Label htmlFor={element.id}>
              {element.properties.label || "URL"}
            </Label>
            <Input
              id={element.id}
              type="url"
              placeholder={element.properties.placeholder || "Enter URL"}
              disabled
              className="w-[90%]"
            />
          </div>
        );
      case "file":
        return (
          <div className="space-y-2">
            <Label htmlFor={element.id}>
              {element.properties.label || "File Upload"}
            </Label>
            <Input id={element.id} type="file" disabled className="w-[90%]" />
          </div>
        );
      case "image":
        return (
          <div className="space-y-2">
            <Label htmlFor={element.id}>
              {element.properties.label || "Image Upload"}
            </Label>
            <Input
              id={element.id}
              type="file"
              accept="image/*"
              disabled
              className="w-[90%]"
              multiple={element.properties.multiple}
            />
            {element.properties.multiple && (
              <p className="text-xs text-muted-foreground">
                Max: {element.properties.maxFiles || "unlimited"} files
                {element.properties.maxSize &&
                  `, ${element.properties.maxSize}MB each`}
              </p>
            )}
          </div>
        );
      case "signature":
        return (
          <div className="space-y-2">
            <Label htmlFor={element.id}>
              {element.properties.label || "Signature"}
            </Label>
            <div className="w-[90%]">
              <SignaturePad readonly={true} />
            </div>
          </div>
        );
      case "header": {
        type HeaderSize = "1" | "2" | "3" | "4" | "5";

        const sizeClasses: Record<HeaderSize, string> = {
          "1": "text-4xl",
          "2": "text-3xl",
          "3": "text-2xl",
          "4": "text-xl",
          "5": "text-lg",
        };

        const rawSize = element?.properties?.size ?? "1";

        // Validate that the size is one of the allowed keys
        const headerSize: HeaderSize = ["1", "2", "3", "4", "5"].includes(
          rawSize
        )
          ? (rawSize as HeaderSize)
          : "1";

        return (
          <div className="space-y-1 w-[90%]">
            <h2 className={`${sizeClasses[headerSize]} font-bold break-words`}>
              {element.properties.label || "Header"}
            </h2>
            {element.properties.description && (
              <p className="text-muted-foreground text-sm">
                {element.properties.description}
              </p>
            )}
          </div>
        );
      }

      default:
        return <div>Unknown element type</div>;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn("relative mb-2", isDragging && "opacity-50")}
    >
      <Card
        className={cn("relative", isSelected && "ring-2 ring-primary")}
        onClick={() => selectElement(element.id)}
      >
        <div
          className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab opacity-50 hover:opacity-100"
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              removeElement(element.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <CardContent className="p-4 pl-9">{renderFormElement()}</CardContent>
      </Card>
    </div>
  );
}

function TabContent({ tab }: { tab: FormTab }) {
  const { moveElement } = useFormBuilderStore();
  const { setNodeRef } = useDroppable({
    id: `tab-droppable-${tab.id}`,
  });

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = tab.elements.findIndex(
        (element) => element.id === active.id
      );
      const newIndex = tab.elements.findIndex(
        (element) => element.id === over.id
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(tab.elements, oldIndex, newIndex);
        moveElement(tab.id, newOrder);
      }
    }
  };

  return (
    <div
      ref={setNodeRef}
      className="min-h-[328px] p-4 pb-20 rounded-lg max-w-2xl border border-dashed"
    >
      <SortableContext
        items={tab.elements.map((el) => el.id)}
        strategy={verticalListSortingStrategy}
      >
        {tab.elements.map((element) => (
          <FormElementPreview key={element.id} element={element} />
        ))}
      </SortableContext>

      {tab.elements.length === 0 && (
        <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
          <p>Drag form elements here</p>
        </div>
      )}
    </div>
  );
}

function SinglePageContent() {
  const { formElements, moveElement } = useFormBuilderStore();
  const { setNodeRef } = useDroppable({
    id: "single-page-droppable",
  });

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = formElements.findIndex(
        (element) => element.id === active.id
      );
      const newIndex = formElements.findIndex(
        (element) => element.id === over.id
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(formElements, oldIndex, newIndex);
        moveElement(null, newOrder);
      }
    }
  };

  return (
    <div
      ref={setNodeRef}
      className="min-h-[328px] p-4 pb-20 rounded-lg max-w-2xl border border-dashed"
    >
      <SortableContext
        items={formElements.map((el) => el.id)}
        strategy={verticalListSortingStrategy}
      >
        {formElements.map((element) => (
          <FormElementPreview key={element.id} element={element} />
        ))}
      </SortableContext>

      {formElements.length === 0 && (
        <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
          <p>Drag and drop elements from the left panel to build your form</p>
        </div>
      )}
    </div>
  );
}

export function FormPreview() {
  const {
    formTabs,
    formElements,
    useTabs,
    addFormTab,
    removeTab,
    activeTabId,
    setActiveTab,
    updateTabTitle,
    formTitle,
    formDescription,
    setFormTitle,
    setFormDescription,
  } = useFormBuilderStore();

  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormDescription(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleAddTab = () => {
    addFormTab();
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const startEditingTab = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTabId(id);
    setEditingTitle(title);
  };

  const saveTabTitle = () => {
    if (editingTabId && editingTitle.trim()) {
      updateTabTitle(editingTabId, editingTitle);
    }
    setEditingTabId(null);
  };

  const handleDeleteTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    removeTab(id);
  };

  return (
    <div className="flex-1 p-4 bg-background">
      <div className="max-w-2xl mx-auto bg-background">
        <div className="bg-muted/50 rounded-lg shadow-sm border p-4 mb-4">
          <input
            id="form-title"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="Enter form title"
            className="text-lg font-semibold bg-transparent  focus:outline-none focus:ring-0 focus:border-none w-full cursor-pointer hover:underline"
          />
          <textarea
            ref={textareaRef}
            id="form-description"
            value={formDescription}
            onChange={handleDescriptionChange}
            placeholder="Enter form description"
            className="h-auto resize-none overflow-hidden text-sm w-full text-muted-foreground focus:outline-none focus:ring-0 focus:border-none hover:underline cursor-pointer bg-transparent"
          />
        </div>

        {useTabs ? (
          formTabs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 border border-dashed rounded-lg">
              <p className="text-muted-foreground mb-4">No tabs created yet</p>
              <Button onClick={handleAddTab}>Create First Tab</Button>
            </div>
          ) : (
            <Tabs
              value={activeTabId || undefined}
              onValueChange={handleTabChange}
              className="w-full relative"
            >
              <ScrollArea className=" flex items-center w-[92%] mb-4 rounded-md">
                <TabsList className="flex-1 w-full gap-2">
                  {formTabs.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="relative group"
                    >
                      {editingTabId === tab.id ? (
                        <Input
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onBlur={saveTabTitle}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              saveTabTitle();
                            }
                          }}
                          autoFocus
                          className="w-24 h-7 px-2 py-0"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <div className="flex items-center">
                          <span className="group-hover:underline">
                            {tab.title}
                          </span>
                          <div className="ml-3 opacity-0 group-hover:opacity-100 flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 p-0"
                              onClick={(e) =>
                                startEditingTab(tab.id, tab.title, e)
                              }
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            {formTabs.length > 1 && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 p-0 text-red-400 hover:text-red-500"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete Tab
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete the &quot;
                                      {tab.title}&quot; tab? This action cannot
                                      be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={(e) =>
                                        handleDeleteTab(tab.id, e)
                                      }
                                      className="bg-red-500 hover:bg-red-400"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </div>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAddTab}
                className=" absolute right-0 top-0"
              >
                <Plus className="h-4 w-4" />
              </Button>

              <ScrollArea className="h-[calc(100vh-16rem)]">
                {formTabs.map((tab) => (
                  <TabsContent key={tab.id} value={tab.id} className="mt-0">
                    <TabContent tab={tab} />
                  </TabsContent>
                ))}
              </ScrollArea>
            </Tabs>
          )
        ) : (
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <SinglePageContent />
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
