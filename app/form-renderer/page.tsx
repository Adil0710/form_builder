"use client";

import type React from "react";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon } from "lucide-react";

import type { FormData, FormElement, FormTab } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { SignaturePad } from "@/components/signature-pad";

export default function FormRenderer() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const signatureRefs = useRef<Record<string, any>>({});

  useEffect(() => {
    // Load form data from localStorage
    const savedForm = localStorage.getItem("savedForm");
    if (savedForm) {
      try {
        const parsedForm = JSON.parse(savedForm);
        setFormData(parsedForm);

        // Set the first tab as active if using tabs
        if (
          parsedForm.useTabs &&
          parsedForm.tabs &&
          parsedForm.tabs.length > 0
        ) {
          setActiveTab(parsedForm.tabs[0].id);
        }
      } catch (error) {
        console.error("Failed to load form data:", error);
      }
    }
  }, []);

  const handleInputChange = (id: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      let isValid = true;
      const validateElements = (elements: FormElement[]) => {
        elements.forEach((element) => {
          if (element.properties.required && !formValues[element.id]) {
            isValid = false;
          }
        });
      };

      if (formData) {
        if (formData.useTabs) {
          formData.tabs.forEach((tab) => {
            validateElements(tab.elements);
          });
        } else {
          validateElements(formData.elements || []);
        }
      }

      if (!isValid) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // In a real application, you would send this data to your backend
      // For demo purposes, we'll just show a success message
      console.log("Form submission data:", formValues);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Form Submitted",
        description: "Your form has been submitted successfully",
      });

      // Clear form values
      setFormValues({});

      // Redirect to home after submission
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Submission Error",
        description: "There was an error submitting your form",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormElement = (element: FormElement) => {
    switch (element.type) {
      case "input":
        return (
          <div className="space-y-2" key={element.id}>
            <Label htmlFor={element.id}>
              {element.properties.label || "Text Input"}
              {element.properties.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Input
              id={element.id}
              placeholder={element.properties.placeholder || "Enter text"}
              value={formValues[element.id] || ""}
              onChange={(e) => handleInputChange(element.id, e.target.value)}
              required={element.properties.required}
            />
          </div>
        );
      case "textarea":
        return (
          <div className="space-y-2" key={element.id}>
            <Label htmlFor={element.id}>
              {element.properties.label || "Text Area"}
              {element.properties.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Textarea
              id={element.id}
              placeholder={element.properties.placeholder || "Enter text"}
              value={formValues[element.id] || ""}
              onChange={(e) => handleInputChange(element.id, e.target.value)}
              required={element.properties.required}
            />
          </div>
        );
      case "checkbox":
        return (
          <div className="space-y-2" key={element.id}>
            <Label>
              {element.properties.label || "Checkbox Group"}
              {element.properties.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <div className="space-y-2">
              {(element.properties.options || ["Option 1", "Option 2"]).map(
                (option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${element.id}-${index}`}
                      name={element.id}
                      value={option}
                      checked={formValues[`${element.id}-${index}`] || false}
                      onChange={(e) =>
                        handleInputChange(
                          `${element.id}-${index}`,
                          e.target.checked
                        )
                      }
                      required={element.properties.required && index === 0}
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
          <div className="space-y-2" key={element.id}>
            <Label htmlFor={element.id}>
              {element.properties.label || "Select"}
              {element.properties.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <select
              id={element.id}
              className="w-full p-2 border rounded-md bg-background"
              value={formValues[element.id] || ""}
              onChange={(e) => handleInputChange(element.id, e.target.value)}
              required={element.properties.required}
            >
              <option value="">
                {element.properties.placeholder || "Select an option"}
              </option>
              {element.properties.options?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );
      case "radio":
        return (
          <div className="space-y-2" key={element.id}>
            <Label>
              {element.properties.label || "Radio Group"}
              {element.properties.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <div className="space-y-2">
              {(element.properties.options || ["Option 1", "Option 2"]).map(
                (option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`${element.id}-${index}`}
                      name={element.id}
                      value={option}
                      checked={formValues[element.id] === option}
                      onChange={() => handleInputChange(element.id, option)}
                      required={element.properties.required && index === 0}
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
          <div className="space-y-2" key={element.id}>
            <Label htmlFor={element.id}>
              {element.properties.label || "Date Picker"}
              {element.properties.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <div className="relative">
              <Input
                id={element.id}
                type="date"
                placeholder={element.properties.placeholder || "Select date"}
                value={formValues[element.id] || ""}
                onChange={(e) => handleInputChange(element.id, e.target.value)}
                required={element.properties.required}
              />
              <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 opacity-50 pointer-events-none" />
            </div>
          </div>
        );
      case "phone":
        return (
          <div className="space-y-2" key={element.id}>
            <Label htmlFor={element.id}>
              {element.properties.label || "Phone Number"}
              {element.properties.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Input
              id={element.id}
              placeholder={
                element.properties.placeholder || "Enter phone number"
              }
              value={formValues[element.id] || ""}
              onChange={(e) => handleInputChange(element.id, e.target.value)}
              required={element.properties.required}
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
      case "email":
        return (
          <div className="space-y-1" key={element.id}>
            <Label htmlFor={`preview-${element.id}`}>
              {element.properties.label || "Email Id"}
              {element.properties.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Input
              id={`preview-${element.id}`}
              name={`preview-${element.id}`}
              placeholder={element.properties.placeholder || "Enter email id"}
              className="h-8 text-xs"
              required={element.properties.required}
              value={formValues[element.id] || ""}
              onChange={(e) => handleInputChange(element.id, e.target.value)}
              type="email"
            />
          </div>
        );
      case "url":
        return (
          <div className="space-y-2" key={element.id}>
            <Label htmlFor={element.id}>
              {element.properties.label || "URL"}
              {element.properties.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Input
              id={element.id}
              type="url"
              placeholder={element.properties.placeholder || "Enter URL"}
              value={formValues[element.id] || ""}
              onChange={(e) => handleInputChange(element.id, e.target.value)}
              required={element.properties.required}
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                // Remove spaces and illegal characters for URLs
                input.value = input.value.replace(
                  /[^\w\-._~:/?#[\]@!$&'()*+,;=%]/gi,
                  ""
                );
              }}
            />
          </div>
        );
      case "file":
        return (
          <div className="space-y-2" key={element.id}>
            <Label htmlFor={element.id}>
              {element.properties.label || "File Upload"}
              {element.properties.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Input
              id={element.id}
              type="file"
              onChange={(e) =>
                handleInputChange(element.id, e.target.files?.[0] || null)
              }
              required={element.properties.required}
            />
          </div>
        );
      case "image":
        return (
          <div className="space-y-2" key={element.id}>
            <Label htmlFor={element.id}>
              {element.properties.label || "Image Upload"}
              {element.properties.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Input
              id={element.id}
              type="file"
              accept="image/*"
              multiple={element.properties.multiple}
              onChange={(e) =>
                handleInputChange(element.id, e.target.files || null)
              }
              required={element.properties.required}
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
          <div className="space-y-2" key={element.id}>
            <Label htmlFor={element.id}>
              {element.properties.label || "Signature"}
              {element.properties.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <SignaturePad className=" h-32"/>
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
        return <div key={element.id}>Unknown element type</div>;
    }
  };

  const renderTabContent = (tab: FormTab) => {
    return (
      <div className="space-y-6">
        {tab.elements.map((element) => renderFormElement(element))}
      </div>
    );
  };

  if (!formData) {
    return (
      <div className="container p-10">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Form not found</CardTitle>
            <CardDescription>
              The requested form could not be loaded.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push("/")}>
              Return to Form Builder
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container p-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{formData.title || "Form Submission"}</CardTitle>
          <CardDescription>
            {formData.description || "Please fill out the form below"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            {formData.useTabs && formData.tabs.length > 1 ? (
              <Tabs
                value={activeTab || undefined}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="mb-4">
                  {formData.tabs.map((tab) => (
                    <TabsTrigger key={tab.id} value={tab.id}>
                      {tab.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {formData.tabs.map((tab) => (
                  <TabsContent key={tab.id} value={tab.id}>
                    {renderTabContent(tab)}
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <div className="space-y-6">
                {formData.useTabs && formData.tabs.length > 0
                  ? formData.tabs[0].elements.map((element) =>
                      renderFormElement(element)
                    )
                  : (formData.elements || []).map((element) =>
                      renderFormElement(element)
                    )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push("/")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
