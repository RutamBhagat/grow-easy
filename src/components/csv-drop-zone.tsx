"use client";

import { useState } from "react";
import { parse } from "csv-parse/browser/esm/sync";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import { CsvFilePicker } from "@/components/csv-file-picker";
import { CsvPreview, type CsvPreviewData } from "@/components/csv-preview";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";

const MAX_FILE_SIZE = 4.5 * 1024 * 1024; // vercel limit
const PREVIEW_ROW_LIMIT = 100;

function CsvDropZone() {
  const [file, setFile] = useState<File>();
  const [preview, setPreview] = useState<CsvPreviewData>();
  const [parseError, setParseError] = useState("");
  const [isParsing, setIsParsing] = useState(false);

  async function previewCsv(nextFile: File) {
    setFile(nextFile);
    setPreview(undefined);
    setParseError("");
    setIsParsing(true);

    try {
      const records = parse(await nextFile.text(), {
        bom: true, // prevent byte order mark microsoft excel edge case for headers
        relax_column_count: true,
        skip_empty_lines: true,
      });

      const [headerRow] = records;

      if (!headerRow) {
        throw new Error("The CSV file is empty.");
      }

      const columnCount = records.reduce(
        (largest, row) => Math.max(largest, row.length),
        0,
      );
      const columns = Array.from({ length: columnCount }, (_, index) => {
        const header = headerRow[index]?.trim();
        return header?.length ? header : `Column ${index + 1}`;
      });
      const rows = records
        .slice(1, PREVIEW_ROW_LIMIT + 1)
        .map((row) => columns.map((_, index) => row[index] ?? ""));

      setPreview({ columns, rows, totalRows: records.length - 1 });
    } catch (error) {
      setParseError(
        error instanceof Error ? error.message : "Could not read this CSV.",
      );
    } finally {
      setIsParsing(false);
    }
  }

  const { fileRejections, getInputProps, getRootProps, isDragActive } =
    useDropzone({
      accept: { "text/csv": [".csv"] },
      maxSize: MAX_FILE_SIZE,
      multiple: false,
      onDropAccepted: ([nextFile]) => {
        if (nextFile) void previewCsv(nextFile);
      },
      onDropRejected: () => {
        setFile(undefined);
        setPreview(undefined);
        setParseError("");
      },
    });

  const rejectedFile = fileRejections[0];
  const isTooLarge = rejectedFile?.errors.some(
    (error) => error.code === "file-too-large",
  );
  const error = rejectedFile
    ? isTooLarge
      ? "CSV files must be 4.5 MB or smaller."
      : "Choose a CSV file."
    : "";
  const displayError = error.length ? error : parseError;

  return (
    <>
      {preview ? (
        <CsvPreview
          fileName={file?.name}
          getInputProps={getInputProps}
          getRootProps={getRootProps}
          preview={preview}
        />
      ) : (
        <CsvFilePicker
          error={displayError}
          getInputProps={getInputProps}
          getRootProps={getRootProps}
          isDragActive={isDragActive}
          isParsing={isParsing}
        />
      )}

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
          disabled={!preview}
        >
          Confirm import
        </Button>
      </DialogFooter>
    </>
  );
}

export { CsvDropZone };
