interface FileValidationProps {
  type?: "image" | "file";
  maxFiles?: string | number;
  maxSize?: string | number; // in MB
  allowedTypes?: string[];   // e.g. ['image/', 'application/pdf']
}

export const validateFiles = (
  files: FileList | null,
  { type = "file", maxFiles, maxSize, allowedTypes }: FileValidationProps
): string | null => {
  const max = maxFiles ? Number(maxFiles) : 1;
  const sizeLimit = maxSize
    ? Number(maxSize)
    : type === "image"
      ? 2 // default 2MB for images
      : 10; // default 10MB for other files

  if (!files) return null;

  const fileArray = Array.from(files);

  if (fileArray.length > max) {
    return `You can upload up to ${max} file(s).`;
  }

  for (const file of fileArray) {
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > sizeLimit) {
      return `Each file must be under ${sizeLimit}MB.`;
    }

    if (allowedTypes && !allowedTypes.some((type) => file.type.startsWith(type))) {
      return `File type not allowed. Allowed types: ${allowedTypes.join(", ")}`;
    }
  }

  return null;
};
