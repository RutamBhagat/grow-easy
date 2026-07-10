"use client";

import { InfoIcon, UploadIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 4.5 * 1024 * 1024; // vercel limit

function CsvDropZone() {
  const {
    acceptedFiles,
    fileRejections,
    getInputProps,
    getRootProps,
    isDragActive,
  } = useDropzone({
    accept: { "text/csv": [".csv"] },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
  });

  const file = acceptedFiles[0];
  const rejectedFile = fileRejections[0];
  const isTooLarge = rejectedFile?.errors.some(
    (error) => error.code === "file-too-large",
  );
  const error = rejectedFile
    ? isTooLarge
      ? "CSV files must be 4.5 MB or smaller."
      : "Choose a CSV file."
    : "";

  return (
    <>
      <div
        {...getRootProps({
          className: cn(
            "bg-muted/40 hover:border-primary/60 hover:bg-muted/70 focus-within:ring-ring/50 mx-auto flex aspect-square w-full cursor-pointer flex-col justify-center gap-4 rounded-xl border-2 border-dashed p-6 text-center transition-colors focus-within:ring-3",
            isDragActive && "border-primary bg-primary/5",
          ),
        })}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <span className="bg-background ring-foreground/10 flex size-12 items-center justify-center rounded-lg shadow-sm ring-1">
            <UploadIcon className="size-5" />
          </span>
          <span className="font-medium">
            {file ? file.name : "Drop your CSV file here"}
          </span>
          <span className="text-muted-foreground text-xs">
            {file ? "Click or drop to replace" : "or click to browse"}
          </span>
        </div>

        <div className="bg-background/70 text-muted-foreground ring-foreground/10 mx-auto flex w-fit items-center gap-2 rounded-lg px-3 py-2 text-xs ring-1">
          <InfoIcon className="size-4" />
          Supported file: .csv (max 4.5 MB)
        </div>

        {error && (
          <p role="alert" className="text-destructive text-xs">
            {error}
          </p>
        )}

        <p className="text-muted-foreground text-xs leading-relaxed">
          <span className="text-foreground font-medium">Note:</span> Add
          headers: created_at, name, email, country_code,
          mobile_without_country_code, company, city, state, country,
          lead_owner, crm_status, crm_note, data_source, possession_time, and
          description seperated by comma
        </p>
      </div>

      <DialogFooter className="mx-0 mb-0 grid grid-cols-2 gap-3 border-t-0 bg-transparent p-0">
        <DialogClose
          render={
            <Button
              variant="outline"
              className="h-12 w-full rounded-xl text-base font-semibold"
            />
          }
        >
          Cancel
        </DialogClose>
        <Button
          className="h-12 w-full rounded-xl bg-[#ff9f88] text-base font-semibold text-white hover:bg-[#f58f76]"
          disabled={!file}
        >
          Upload File
        </Button>
      </DialogFooter>
    </>
  );
}

export { CsvDropZone };
