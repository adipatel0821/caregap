"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileImage, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UploadCardProps {
  onFile: (file: File) => void;
  disabled?: boolean;
}

export function UploadCard({ onFile, disabled }: UploadCardProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (accepted: File[], rejected: unknown[]) => {
      setError(null);
      if (rejected && (rejected as unknown[]).length > 0) {
        setError("Only JPG, PNG, or PDF files up to 10 MB.");
        return;
      }
      if (accepted.length > 0) {
        onFile(accepted[0]);
      }
    },
    [onFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "application/pdf": [".pdf"],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    disabled,
  });

  return (
    <Card
      {...getRootProps()}
      className={`
        p-10 border-2 border-dashed cursor-pointer transition-all duration-200
        ${isDragActive
          ? "border-[var(--color-teal)] bg-[var(--color-teal)]/5"
          : "border-border hover:border-[var(--color-teal)]/40 hover:bg-[var(--color-warm-gray)]"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[var(--color-teal)]/10 flex items-center justify-center">
          {isDragActive ? (
            <FileImage className="h-7 w-7 text-[var(--color-teal)]" />
          ) : (
            <Upload className="h-7 w-7 text-[var(--color-teal)]" />
          )}
        </div>
        <div>
          <p className="font-serif text-lg font-medium">
            {isDragActive ? "Drop your bill here" : "Upload your medical bill"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Drag and drop a JPG, PNG, or PDF — up to 10 MB
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-2 border-[var(--color-teal)]/30 text-[var(--color-teal)]"
          onClick={(e) => e.stopPropagation()}
        >
          Browse files
        </Button>
        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive mt-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
      </div>
    </Card>
  );
}
