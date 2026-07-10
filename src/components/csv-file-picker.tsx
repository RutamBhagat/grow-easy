import { InfoIcon, UploadIcon } from "lucide-react";
import type { DropzoneState } from "react-dropzone";

import { cn } from "@/lib/utils";

type CsvFilePickerProps = Pick<
  DropzoneState,
  "getInputProps" | "getRootProps" | "isDragActive"
> & {
  error: string;
  isParsing: boolean;
};

function CsvFilePicker({
  error,
  getInputProps,
  getRootProps,
  isDragActive,
  isParsing,
}: CsvFilePickerProps) {
  return (
    <div
      {...getRootProps({
        className: cn(
          "bg-muted/40 hover:border-primary/60 hover:bg-muted/70 focus-within:ring-ring/50 mx-auto flex aspect-square w-full max-w-lg cursor-pointer flex-col justify-center gap-4 rounded-xl border-2 border-dashed p-6 text-center transition-colors focus-within:ring-3",
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
          {isParsing ? "Reading your CSV…" : "Drop your CSV file here"}
        </span>
        <span className="text-muted-foreground text-xs">
          or click to browse
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
        Your first row should contain column headers. The importer will map them
        to GrowEasy CRM fields after you confirm.
      </p>
    </div>
  );
}

export { CsvFilePicker };
