import { generateText, Output } from "ai";

import { env } from "@/env";
import { crmExtractionPrompt } from "@/server/ai/crm-extraction-prompt";
import {
  batchResultSchema,
  type ExtractionResult,
} from "@/server/ai/crm-schemas";
import { openaiProvider } from "@/server/ai/openai-provider";

const BATCH_SIZE = 20;
type SourceRecord = Record<string, string>;

export async function extractCrmRecords({
  sourceRecords,
}: {
  sourceRecords: SourceRecord[];
}): Promise<ExtractionResult> {
  const result: ExtractionResult = { records: [], skippedRecords: [] };

  // process one small batch at a time to avoid ai rate limits
  for (let start = 0; start < sourceRecords.length; start += BATCH_SIZE) {
    const batch = sourceRecords.slice(start, start + BATCH_SIZE);
    const { output } = await generateText({
      model: openaiProvider(env.OPENAI_MODEL),
      output: Output.array({ element: batchResultSchema }),
      system: crmExtractionPrompt,
      prompt: `Extract CRM records from these rows in the same order:\n${JSON.stringify(batch)}`,
    });

    // keep valid records and collect rows skipped by the ai
    output.forEach((item, index) => {
      if (item.record) {
        result.records.push(item.record);
      } else {
        result.skippedRecords.push({
          source: batch[index]!,
          reason: item.skip_reason,
        });
      }
    });
  }

  return result;
}
