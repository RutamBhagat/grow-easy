import { generateText, Output } from "ai";

import { env } from "@/env";
import { crmExtractionPrompt } from "@/server/ai/crm-extraction-prompt";
import {
  batchResultSchema,
  type CrmRecord,
  type ExtractionResult,
  type SkippedRecord,
} from "@/server/ai/crm-schemas";
import { openaiProvider } from "@/server/ai/openai-provider";

export async function extractCrmRecords({
  sourceRecords,
}: {
  sourceRecords: Record<string, string>[];
}): Promise<ExtractionResult> {
  const records: CrmRecord[] = [];
  const skippedRecords: SkippedRecord[] = [];

  // process records in small batches to to keep ai context window small
  for (let start = 0; start < sourceRecords.length; start += 20) {
    const batch = sourceRecords.slice(start, start + 20);

    // attach a local index so ai results can be matched even if reordered
    const indexedBatch = batch.map((source, batchIndex) => ({
      source_index: batchIndex,
      source,
    }));

    // ask the model for schema validated records for this batch
    const { output } = await generateText({
      model: openaiProvider(env.OPENAI_MODEL),
      output: Output.array({ element: batchResultSchema }),
      system: crmExtractionPrompt,
      prompt: `Extract CRM records from these rows:\n${JSON.stringify(indexedBatch)}`,
    });

    // index ai results by their original position for quick lookup
    const resultsByIndex = new Map(
      output.map((result) => [result.source_index, result]),
    );

    // keep valid contacts and track every missing or invalid result as skipped
    batch.forEach((source, batchIndex) => {
      const result = resultsByIndex.get(batchIndex);
      const record = result?.record;
      const hasEmail = Boolean(record?.email);
      const hasMobile = Boolean(record?.mobile_without_country_code);
      const hasContact = hasEmail || hasMobile;

      if (record && hasContact) {
        records.push(record);
      } else {
        skippedRecords.push({
          sourceIndex: start + batchIndex,
          source,
          reason: result?.skip_reason ?? "AI did not return a valid contact",
        });
      }
    });
  }

  return { records, skippedRecords };
}
