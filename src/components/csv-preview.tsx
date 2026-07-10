import { FileSpreadsheetIcon } from "lucide-react";
import type { DropzoneState } from "react-dropzone";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type CsvPreviewData = {
  columns: string[];
  rows: string[][];
  totalRows: number;
};

type CsvPreviewProps = Pick<
  DropzoneState,
  "getInputProps" | "getRootProps"
> & {
  fileName: string | undefined;
  preview: CsvPreviewData;
};

function CsvPreview({
  fileName,
  getInputProps,
  getRootProps,
  preview,
}: CsvPreviewProps) {
  return (
    <div className="min-w-0 space-y-3">
      <div
        {...getRootProps({
          className:
            "bg-muted/40 hover:bg-muted/70 focus-within:ring-ring/50 flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors focus-within:ring-3",
        })}
      >
        <input {...getInputProps()} />
        <span className="bg-background ring-foreground/10 flex size-10 shrink-0 items-center justify-center rounded-lg shadow-sm ring-1">
          <FileSpreadsheetIcon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{fileName}</p>
          <p className="text-muted-foreground text-xs">
            {preview.columns.length} columns · {preview.totalRows} rows
          </p>
        </div>
        <span className="text-muted-foreground text-xs font-medium">
          Change file
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border **:data-[slot=table-container]:max-h-[45vh] **:data-[slot=table-container]:overflow-auto">
        <Table className="min-w-max">
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow className="hover:bg-muted">
              {preview.columns.map((column, index) => (
                <TableHead key={`${column}-${index}`} className="px-3">
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {preview.rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell
                    key={cellIndex}
                    className="max-w-72 truncate px-3"
                    title={cell}
                  >
                    {cell || <span className="text-muted-foreground">—</span>}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!preview.rows.length && (
          <p className="text-muted-foreground p-8 text-center text-sm">
            This CSV has headers but no data rows.
          </p>
        )}
      </div>

      {preview.totalRows > preview.rows.length && (
        <p className="text-muted-foreground text-xs">
          Showing the first {preview.rows.length} of {preview.totalRows} rows.
        </p>
      )}
    </div>
  );
}

export { CsvPreview };
export type { CsvPreviewData };
