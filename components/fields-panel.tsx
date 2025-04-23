"use client"

import type React from "react"

import { useDraggable } from "@dnd-kit/core"
import {
  CalendarIcon,
  CheckSquare,
  FileText,
  FormInput,
  ImageIcon,
  List,
  Phone,
  Radio,
  Type,
  LinkIcon as Url,
  PenLine,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface FieldItemProps {
  id: string
  label: string
  icon: React.ReactNode
}

function FieldItem({ id, label, icon }: FieldItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "flex items-center gap-2 p-3 border rounded-md cursor-grab bg-background hover:border-primary",
        isDragging && "opacity-50",
      )}
    >
      {icon}
      <span>{label}</span>
    </div>
  )
}

export function FieldsPanel() {
  const fields = [
    { id: "new-header", label: "Header", icon: <Type className="h-4 w-4" /> },
    { id: "new-input", label: "Text Input", icon: <FormInput className="h-4 w-4" /> },
    { id: "new-textarea", label: "Text Area", icon: <FileText className="h-4 w-4" /> },
    { id: "new-checkbox", label: "Checkbox", icon: <CheckSquare className="h-4 w-4" /> },
    { id: "new-select", label: "Select", icon: <List className="h-4 w-4" /> },
    { id: "new-radio", label: "Radio Group", icon: <Radio className="h-4 w-4" /> },
    { id: "new-date", label: "Date Picker", icon: <CalendarIcon className="h-4 w-4" /> },
    { id: "new-phone", label: "Phone Number", icon: <Phone className="h-4 w-4" /> },
    { id: "new-url", label: "URL", icon: <Url className="h-4 w-4" /> },
    { id: "new-file", label: "File Upload", icon: <FileText className="h-4 w-4" /> },
    { id: "new-image", label: "Image Upload", icon: <ImageIcon className="h-4 w-4" /> },
    { id: "new-signature", label: "Signature", icon: <PenLine className="h-4 w-4" /> },
  ]

  return (
    <div className="w-64 border-r bg-muted/20">
      <div className="p-4 font-medium">Form Elements</div>
      <Separator />
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="grid gap-2 p-4">
          {fields.map((field) => (
            <FieldItem key={field.id} id={field.id} label={field.label} icon={field.icon} />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
