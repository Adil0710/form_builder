"use client";

import { Separator } from "@/components/ui/separator";
import MobilePreview from "./mobile-preview";

export function PreviewPanel() {
  return (
    <div className="w-80 border-l bg-muted/20">
      <div className="p-4 font-medium">Preview</div>
      <Separator />
      <MobilePreview />
    </div>
  );
}
