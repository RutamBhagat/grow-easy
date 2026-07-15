import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";

import {
  TableSortButton,
  type SortDirection,
} from "@/components/table-sort-button";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CrmRecord, ImportResult } from "@/server/ai/crm-schemas";
import { useImportStore } from "@/stores/import-store";

type CrmColumn = {
  key: keyof CrmRecord;
  label: string;
};

type SortState<Key> = {
  key: Key;
  direction: SortDirection;
};

const crmColumns: CrmColumn[] = [
  { key: "created_at", label: "Created at" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "country_code", label: "Country code" },
  { key: "mobile_without_country_code", label: "Mobile" },
  { key: "company", label: "Company" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "country", label: "Country" },
  { key: "lead_owner", label: "Lead owner" },
  { key: "crm_status", label: "CRM status" },
  { key: "crm_note", label: "CRM note" },
  { key: "data_source", label: "Data source" },
  { key: "possession_time", label: "Possession time" },
  { key: "description", label: "Description" },
];

function compareValues({
  left,
  right,
  direction,
}: {
  left: string;
  right: string;
  direction: SortDirection;
}) {
  const comparison = left.localeCompare(right, undefined, {
    numeric: true,
    sensitivity: "base",
  });

  return direction === "asc" ? comparison : -comparison;
}

function ParsedImportResults({ result }: { result: ImportResult }) {
  const [selectedRecords, setSelectedRecords] = useState<Set<number>>(new Set());
  const [selectedSkippedRecords, setSelectedSkippedRecords] = useState<
    Set<number>
  >(new Set());
  const [recordSort, setRecordSort] =
    useState<SortState<keyof CrmRecord>>();
  const [skippedSort, setSkippedSort] =
    useState<SortState<string | null>>();
  const deleteRecords = useImportStore((state) => state.deleteRecords);
  const deleteSkippedRecords = useImportStore(
    (state) => state.deleteSkippedRecords,
  );
  const skippedColumns = Array.from(
    new Set(
      result.skippedRecords.flatMap((record) => Object.keys(record.source)),
    ),
  );
  const sortedRecords = useMemo(() => {
    const rows = result.records.map((record, index) => ({ record, index }));

    if (!recordSort) return rows;

    return rows.sort(({ record: left }, { record: right }) =>
      compareValues({
        left: left[recordSort.key],
        right: right[recordSort.key],
        direction: recordSort.direction,
      }),
    );
  }, [recordSort, result.records]);
  const sortedSkippedRecords = useMemo(() => {
    const rows = result.skippedRecords.map((record, index) => ({
      record,
      index,
    }));

    if (!skippedSort) return rows;

    return rows.sort(({ record: left }, { record: right }) =>
      compareValues({
        left:
          skippedSort.key === null
            ? left.reason
            : (left.source[skippedSort.key] ?? ""),
        right:
          skippedSort.key === null
            ? right.reason
            : (right.source[skippedSort.key] ?? ""),
        direction: skippedSort.direction,
      }),
    );
  }, [result.skippedRecords, skippedSort]);

  function toggleRecordSort(key: keyof CrmRecord) {
    setRecordSort((current) => ({
      key,
      direction:
        current?.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  }

  function toggleSkippedSort(key: string | null) {
    setSkippedSort((current) => ({
      key,
      direction:
        current?.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  }

  return (
    <div className="space-y-7">
      {result.skippedRecords.length > 0 && (
        <section
          aria-labelledby="skipped-records-heading"
          className="space-y-2.5"
        >
          <div className="flex items-center justify-between gap-4">
            <h2 id="skipped-records-heading" className="text-sm font-semibold">
              Skipped records
            </h2>
            <div className="flex items-center gap-3">
              {selectedSkippedRecords.size > 0 && (
                <span className="text-muted-foreground text-xs">
                  {selectedSkippedRecords.size} selected
                </span>
              )}
              <Button
                variant="destructive"
                size="sm"
                disabled={!selectedSkippedRecords.size}
                onClick={() => {
                  deleteSkippedRecords([...selectedSkippedRecords]);
                  setSelectedSkippedRecords(new Set());
                }}
              >
                <Trash2 />
                Delete
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border **:data-[slot=table-container]:max-h-72 **:data-[slot=table-container]:overflow-auto">
            <Table className="min-w-max">
              <TableHeader className="bg-background sticky top-0 z-10 shadow-[0_1px_0_var(--border)]">
                <TableRow className="hover:bg-background">
                  <TableHead className="bg-background sticky left-0 z-20 h-9 w-10 border-r px-3">
                    <Checkbox
                      aria-label="Select all skipped records"
                      checked={
                        selectedSkippedRecords.size ===
                        result.skippedRecords.length
                      }
                      indeterminate={
                        selectedSkippedRecords.size > 0 &&
                        selectedSkippedRecords.size <
                          result.skippedRecords.length
                      }
                      onCheckedChange={(checked) =>
                        setSelectedSkippedRecords(
                          checked
                            ? new Set(
                                result.skippedRecords.map((_, index) => index),
                              )
                            : new Set(),
                        )
                      }
                    />
                  </TableHead>
                  <TableHead className="text-muted-foreground h-9 px-3 text-[11px] font-medium">
                    <div className="flex items-center gap-1">
                      <span>Reason</span>
                      <TableSortButton
                        label="Reason"
                        direction={
                          skippedSort?.key === null
                            ? skippedSort.direction
                            : undefined
                        }
                        onClick={() => toggleSkippedSort(null)}
                      />
                    </div>
                  </TableHead>
                  {skippedColumns.map((column) => (
                    <TableHead
                      key={column}
                      className="text-muted-foreground h-9 px-3 text-[11px] font-medium"
                    >
                      <div className="flex items-center gap-1">
                        <span>{column}</span>
                        <TableSortButton
                          label={column}
                          direction={
                            skippedSort?.key === column
                              ? skippedSort.direction
                              : undefined
                          }
                          onClick={() => toggleSkippedSort(column)}
                        />
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedSkippedRecords.map(
                  ({ record, index: recordIndex }, rowIndex) => (
                    <TableRow
                      key={recordIndex}
                      data-state={
                        selectedSkippedRecords.has(recordIndex)
                          ? "selected"
                          : undefined
                      }
                    >
                      <TableCell className="bg-background sticky left-0 z-10 h-11 w-10 border-r px-3">
                        <Checkbox
                          aria-label={`Select skipped record ${rowIndex + 1}`}
                          checked={selectedSkippedRecords.has(recordIndex)}
                          onCheckedChange={(checked) => {
                            const nextSelection = new Set(
                              selectedSkippedRecords,
                            );
                            if (checked) {
                              nextSelection.add(recordIndex);
                            } else {
                              nextSelection.delete(recordIndex);
                            }
                            setSelectedSkippedRecords(nextSelection);
                          }}
                        />
                      </TableCell>
                      <TableCell
                        className="h-11 max-w-72 truncate px-3 text-[13px]"
                        title={record.reason}
                      >
                        {record.reason}
                      </TableCell>
                      {skippedColumns.map((column) => (
                        <TableCell
                          key={column}
                          className="h-11 max-w-72 truncate px-3 text-[13px]"
                          title={record.source[column]}
                        >
                          {record.source[column] ?? (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      )}

      <section
        aria-labelledby="imported-records-heading"
        className="space-y-2.5"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 id="imported-records-heading" className="text-sm font-semibold">
            Successfully parsed records
          </h2>
          <div className="flex items-center gap-3">
            {selectedRecords.size > 0 && (
              <span className="text-muted-foreground text-xs">
                {selectedRecords.size} selected
              </span>
            )}
            <Button
              variant="destructive"
              size="sm"
              disabled={!selectedRecords.size}
              onClick={() => {
                deleteRecords([...selectedRecords]);
                setSelectedRecords(new Set());
              }}
            >
              <Trash2 />
              Delete
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border **:data-[slot=table-container]:max-h-[52vh] **:data-[slot=table-container]:overflow-auto">
          <Table className="min-w-max">
            <TableHeader className="bg-background sticky top-0 z-10 shadow-[0_1px_0_var(--border)]">
              <TableRow className="hover:bg-background">
                <TableHead className="bg-background sticky left-0 z-20 h-9 w-10 border-r px-3">
                  <Checkbox
                    aria-label="Select all successfully parsed records"
                    checked={
                      result.records.length > 0 &&
                      selectedRecords.size === result.records.length
                    }
                    indeterminate={
                      selectedRecords.size > 0 &&
                      selectedRecords.size < result.records.length
                    }
                    onCheckedChange={(checked) =>
                      setSelectedRecords(
                        checked
                          ? new Set(result.records.map((_, index) => index))
                          : new Set(),
                      )
                    }
                  />
                </TableHead>
                {crmColumns.map((column) => (
                  <TableHead
                    key={column.key}
                    className="text-muted-foreground h-9 px-3 text-[11px] font-medium"
                  >
                    <div className="flex items-center gap-1">
                      <span>{column.label}</span>
                      <TableSortButton
                        label={column.label}
                        direction={
                          recordSort?.key === column.key
                            ? recordSort.direction
                            : undefined
                        }
                        onClick={() => toggleRecordSort(column.key)}
                      />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRecords.map(({ record, index: recordIndex }, rowIndex) => (
                <TableRow
                  key={`${record.email}-${record.mobile_without_country_code}-${recordIndex}`}
                  data-state={
                    selectedRecords.has(recordIndex) ? "selected" : undefined
                  }
                >
                  <TableCell className="bg-background sticky left-0 z-10 h-11 w-10 border-r px-3">
                    <Checkbox
                      aria-label={`Select successfully parsed record ${rowIndex + 1}`}
                      checked={selectedRecords.has(recordIndex)}
                      onCheckedChange={(checked) => {
                        const nextSelection = new Set(selectedRecords);
                        if (checked) {
                          nextSelection.add(recordIndex);
                        } else {
                          nextSelection.delete(recordIndex);
                        }
                        setSelectedRecords(nextSelection);
                      }}
                    />
                  </TableCell>
                  {crmColumns.map((column) => (
                    <TableCell
                      key={column.key}
                      className="h-11 max-w-72 truncate px-3 text-[13px]"
                      title={record[column.key]}
                    >
                      {record[column.key] || (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!result.records.length && (
            <p className="text-muted-foreground p-10 text-center text-sm">
              No valid lead records were found.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export { ParsedImportResults };
