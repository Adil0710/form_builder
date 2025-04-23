"use client";

import { useState, useEffect } from "react";
import { CalendarIcon } from 'lucide-react';

import type { FormElement } from "@/lib/types";
import { useFormBuilderStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import SignaturePad from "./signature-pad";

export function MobilePreview() {
  const formTabs = useFormBuilderStore((state) => state.formTabs);
  const formElements = useFormBuilderStore((state) => state.formElements);
  const useTabs = useFormBuilderStore((state) => state.useTabs);
  const activeTabId = useFormBuilderStore((state) => state.activeTabId);
  const [activePreviewTab, setActivePreviewTab] = useState<string | null>(null);

  // Set the active preview tab once when component mounts or when activeTabId changes
  useEffect(() => {
    setActivePreviewTab(activeTabId);
  }, [activeTabId]);

  if (
    (useTabs && formTabs.length === 0) ||
    (!useTabs && formElements.length === 0)
  ) {
    return (
      <div className="p-4 flex justify-center items-center">
        <div className="w-64 h-[500px] border rounded-[20px] overflow-hidden flex flex-col bg-background shadow-md mt-5">
          <div className="h-6 bg-muted flex items-center justify-center rounded-t-[20px]">
            <div className="w-20 h-2 bg-background rounded-full" />
          </div>
          <div className="flex-1 relative items-center justify-center overflow-hidden p-2">
            <p className="text-sm absolute top-1/2 -translate-y-1/2 text-muted-foreground text-center px-4">
              Add form elements to see a preview
            </p>
          </div>
          <div className="h-10 bg-muted flex items-center justify-center rounded-b-[20px]">
            <Button size="sm" className="h-6 text-xs" disabled>
              Submit
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If active tab doesn't exist, use the first tab
  const currentTabId =
    activePreviewTab && formTabs.some((tab) => tab.id === activePreviewTab)
      ? activePreviewTab
      : formTabs[0]?.id || null;

  const renderFormElement = (element: FormElement) => {
    switch (element.type) {
      case "input":
        return (
          <div className="space-y-1" key={element.id}>
            <Label htmlFor={`preview-${element.id}`} className="text-xs">
              {element.properties.label || "Text Input"}
              {element.properties.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Input
              id={`preview-${element.id}`}
              placeholder={element.properties.placeholder || "Enter text"}
              className="h-8 text-xs"
            /> 
          </div>
        );
      case "textarea":
        return (
          <div className="space-y-1" key={element.id}>
            <Label htmlFor={`preview-${element.id}`} className="text-xs">
              {element.properties.label || "Text Area"}
              {element.properties.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Textarea
              id={`preview-${element.id}`}
              placeholder={element.properties.placeholder || "Enter text"}
              className="text-xs min-h-[60px]"
            />
          </div>
        );
      case "checkbox":
        return (
          <div className="space-y-1" key={element.id}>
            <Label className="text-xs">
              {element.properties.label || "Checkbox Group"}
              {element.properties.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <div className="space-y-1">
              {(element.properties.options || ["Option 1", "Option 2"]).map(
                (option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`preview-${element.id}-${index}`}
                      className="scale-75"
                    />
                    <Label
                      htmlFor={`preview-${element.id}-${index}`}
                      className="text-xs"
                    >
                      {option}
                    </Label>
                  </div>
                )
              )}
            </div>
          </div>
        );
      case "select":
        return (
          <div className="space-y-1" key={element.id}>
            <Label htmlFor={`preview-${element.id}`} className="text-xs">
              {element.properties.label || "Select"}
              {element.properties.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <select
              id={`preview-${element.id}`}
              className="w-full p-1 border rounded-md bg-background text-xs h-8"
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
          <div className="space-y-1" key={element.id}>
            <Label className="text-xs">
              {element.properties.label || "Radio Group"}
              {element.properties.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <div className="space-y-1">
              {(element.properties.options || ["Option 1", "Option 2"]).map(
                (option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`preview-${element.id}-${index}`}
                      name={`preview-${element.id}`}
                      className="scale-75"
                    />
                    <Label
                      htmlFor={`preview-${element.id}-${index}`}
                      className="text-xs"
                    >
                      {option}
                    </Label>
                  </div>
                )
              )}
            </div>
          </div>
        );
      case "date":
        return (
          <div className="space-y-1" key={element.id}>
            <Label htmlFor={`preview-${element.id}`} className="text-xs">
              {element.properties.label || "Date Picker"}
              {element.properties.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <div className="relative w-full">
              <Input
                id={`preview-${element.id}`}
                type="date"
                placeholder={element.properties.placeholder || "Select date"}
                className="h-8 text-xs w-full"
              />
              <CalendarIcon className="absolute right-2 top-2 h-4 w-4 opacity-50 pointer-events-none" />
            </div>
          </div>
        );
      case "phone":
        return (
          <div className="space-y-1" key={element.id}>
            <Label htmlFor={`preview-${element.id}`} className="text-xs">
              {element.properties.label || "Phone Number"}
              {element.properties.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Input
              id={`preview-${element.id}`}
              placeholder={
                element.properties.placeholder || "Enter phone number"
              }
              className="h-8 text-xs"
              maxLength={10}
              type="text"
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value.replace(/\D/g, ""); // Remove non-numeric characters
                if (input.value.length > 10) {
                  input.value = input.value.slice(0, 10); // Enforce 10 digits max
                }
              }}
            />
          </div>
        );
      case "url":
        return (
          <div className="space-y-1" key={element.id}>
            <Label htmlFor={`preview-${element.id}`} className="text-xs">
              {element.properties.label || "URL"}
              {element.properties.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Input
              id={`preview-${element.id}`}
              type="url"
              placeholder={element.properties.placeholder || "Enter URL"}
              className="h-8 text-xs"
            />
          </div>
        );
      case "file":
        return (
          <div className="space-y-1" key={element.id}>
            <Label htmlFor={`preview-${element.id}`} className="text-xs">
              {element.properties.label || "File Upload"}
              {element.properties.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Input
              id={`preview-${element.id}`}
              type="file"
              className="h-8 text-xs"
            />
          </div>
        );
      case "image":
        return (
          <div className="space-y-1" key={element.id}>
            <Label htmlFor={`preview-${element.id}`} className="text-xs">
              {element.properties.label || "Image Upload"}
              {element.properties.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Input
              id={`preview-${element.id}`}
              type="file"
              accept="image/*"
              multiple={element.properties.multiple}
              className="h-8 text-xs"
            />
            {element.properties.multiple && (
              <p className="text-[10px] text-muted-foreground mt-1">
                Max: {element.properties.maxFiles || "unlimited"} files
                {element.properties.maxSize && `, ${element.properties.maxSize}MB each`}
              </p>
            )}
          </div>
        );
      case "signature":
        return (
          <div className="space-y-1" key={element.id}>
            <Label htmlFor={`preview-${element.id}`} className="text-xs">
              {element.properties.label || "Signature"}
              {element.properties.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
             <SignaturePad />
          </div>
        );
        case "header": {
          type HeaderSize = "1" | "2" | "3" | "4" | "5"
        
          const sizeClasses: Record<HeaderSize, string> = {
            "1": "text-4xl",
            "2": "text-3xl",
            "3": "text-2xl",
            "4": "text-xl",
            "5": "text-lg",
          }
        
          const rawSize = element?.properties?.size ?? "1"
        
          // Validate that the size is one of the allowed keys
          const headerSize: HeaderSize = ["1", "2", "3", "4", "5"].includes(rawSize)
            ? (rawSize as HeaderSize)
            : "1"
        
          return (
            <div className="space-y-1 w-[90%]" key={headerSize}>
              <h2 className={`${sizeClasses[headerSize]} font-bold break-words`}>
                {element.properties.label || "Header"}
              </h2>
              {element.properties.description && (
                <p className="text-muted-foreground text-sm">
                  {element.properties.description}
                </p>
              )}
            </div>
          )
        }
      default:
        return <div key={element.id}>Unknown element type</div>;
    }
  };

  return (
    <div className="p-4 flex justify-center items-center">
      <div className="w-64 h-[500px] border rounded-[20px] overflow-hidden flex flex-col bg-background shadow-md mt-5">
        <div className="h-6 bg-muted flex items-center justify-center rounded-t-[20px]">
          <div className="w-20 h-2 bg-background rounded-full" />
        </div>
        <div className="flex-1 overflow-hidden p-2">
          {useTabs && formTabs.length > 1 ? (
            <Tabs
              value={currentTabId || undefined}
              onValueChange={setActivePreviewTab}
              className="w-full"
            >
              <TabsList className="w-full mb-2 h-8">
                {formTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="text-xs h-6"
                  >
                    {tab.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              {formTabs.map((tab) => (
                <TabsContent
                  key={tab.id}
                  value={tab.id}
                  className="mt-0 data-[state=active]:overflow-auto h-[430px] pb-14"
                >
                  <div className="space-y-3 p-2">
                    {tab.elements.map((element) => renderFormElement(element))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="h-[430px] overflow-auto">
              <div className="space-y-3 p-2 pb-14">
                {useTabs && formTabs.length > 0
                  ? formTabs[0]?.elements.map((element) =>
                      renderFormElement(element)
                    )
                  : formElements.map((element) => renderFormElement(element))}
              </div>
            </div>
          )}
        </div>
        <div className="h-10 bg-muted flex items-center justify-center rounded-b-[20px]">
          <Button size="sm" className="h-6 text-xs">
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MobilePreview;
