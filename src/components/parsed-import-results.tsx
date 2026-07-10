import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CrmRecord, ImportResult } from "@/server/ai/crm-schemas";

type CrmColumn = {
  key: keyof CrmRecord;
  label: string;
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

function ParsedImportResults({ result }: { result: ImportResult }) {
  const skippedColumns = Array.from(
    new Set(
      result.skippedRecords.flatMap((record) => Object.keys(record.source)),
    ),
  );

  return (
    <div className="space-y-7">
      {result.skippedRecords.length > 0 && (
        <section
          aria-labelledby="skipped-records-heading"
          className="space-y-2.5"
        >
          <h2 id="skipped-records-heading" className="text-sm font-semibold">
            Skipped records
          </h2>

          <div className="overflow-hidden rounded-lg border **:data-[slot=table-container]:max-h-72 **:data-[slot=table-container]:overflow-auto">
            <Table className="min-w-max">
              <TableHeader className="bg-background sticky top-0 z-10 shadow-[0_1px_0_var(--border)]">
                <TableRow className="hover:bg-background">
                  {skippedColumns.map((column) => (
                    <TableHead
                      key={column}
                      className="text-muted-foreground h-9 px-3 text-[11px] font-medium"
                    >
                      {column}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.skippedRecords.map((record, rowIndex) => (
                  <TableRow key={`${record.sourceIndex}-${rowIndex}`}>
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
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      )}

      <section
        aria-labelledby="imported-records-heading"
        className="space-y-2.5"
      >
        <h2 id="imported-records-heading" className="text-sm font-semibold">
          Successfully parsed records
        </h2>

        <div className="overflow-hidden rounded-lg border **:data-[slot=table-container]:max-h-[52vh] **:data-[slot=table-container]:overflow-auto">
          <Table className="min-w-max">
            <TableHeader className="bg-background sticky top-0 z-10 shadow-[0_1px_0_var(--border)]">
              <TableRow className="hover:bg-background">
                {crmColumns.map((column) => (
                  <TableHead
                    key={column.key}
                    className="text-muted-foreground h-9 px-3 text-[11px] font-medium"
                  >
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.records.map((record, rowIndex) => (
                <TableRow
                  key={`${record.email}-${record.mobile_without_country_code}-${rowIndex}`}
                >
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
