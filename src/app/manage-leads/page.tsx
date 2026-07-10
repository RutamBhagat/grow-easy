"use client";

import { ParsedImportResults } from "@/components/parsed-import-results";
import { Button } from "@/components/ui/button";
import { useImportStore } from "@/stores/import-store";

function ManageLeadsPage() {
  const result = useImportStore((state) => state.result);
  const reset = useImportStore((state) => state.reset);

  return (
    <div className="min-w-0 p-4 sm:p-6 lg:p-8">
      <header className="mb-6 flex items-end justify-between gap-6">
        <h1 className="text-xl font-semibold tracking-tight">Manage Leads</h1>
        {result && (
          <div className="flex items-center gap-5 pr-4 sm:pr-6">
            <dl className="flex gap-6">
              <div>
                <dt className="text-xs text-muted-foreground">Total imported</dt>
                <dd className="text-sm font-semibold tabular-nums">
                  {result.records.length}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Total skipped</dt>
                <dd className="text-sm font-semibold tabular-nums">
                  {result.skippedRecords.length}
                </dd>
              </div>
            </dl>
            <Button variant="outline" size="sm" onClick={reset}>
              Reset
            </Button>
          </div>
        )}
      </header>

      {result && <ParsedImportResults result={result} />}
    </div>
  );
}

export default ManageLeadsPage;
