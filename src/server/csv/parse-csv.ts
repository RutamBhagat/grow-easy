import { parse } from "csv-parse";
import { z } from "zod";

const csvRecordSchema = z.record(z.string(), z.string());

export async function parseCsv({
  buffer,
}: {
  buffer: Buffer;
}): Promise<Record<string, string>[]> {
  const parser = parse(buffer, {
    bom: true, // prevent byte order mark microsoft excel edge case for headers
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  const records: Record<string, string>[] = [];

  for await (const record of parser) {
    const result = csvRecordSchema.safeParse(record);

    if (!result.success) {
      throw new Error("CSV contains an invalid row");
    }

    records.push(result.data);
  }

  return records;
}
