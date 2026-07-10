"use client";

import { DownloadIcon, UploadIcon } from "lucide-react";

import { CsvDropZone } from "@/components/csv-drop-zone";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function LeadSourcePage() {
  return (
    <div className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Lead Source</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Configure where imported leads come from.
          </p>
        </div>

        <Dialog>
          <DialogTrigger render={<Button />}>
            <UploadIcon />
            Import leads
          </DialogTrigger>
          <DialogContent className="max-h-[calc(100vh-2rem)] gap-6 overflow-y-auto p-6 sm:max-w-lg sm:has-[table]:max-w-6xl [&_[data-slot=dialog-close]]:top-4 [&_[data-slot=dialog-close]]:right-4">
            <DialogHeader>
              <DialogTitle className="text-xl">
                Import leads via CSV
              </DialogTitle>
              <DialogDescription>
                Upload a CSV file to quickly add leads in your system
              </DialogDescription>
              <Button
                variant="secondary"
                className="mt-1 w-fit"
                render={<a href="/sample.csv" download />}
              >
                <DownloadIcon />
                Download Sample File (sample.csv)
              </Button>
            </DialogHeader>
            <CsvDropZone />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
