import { z } from "zod";

const crmStatusSchema = z.enum([
  "",
  "GOOD_LEAD_FOLLOW_UP",
  "DID_NOT_CONNECT",
  "BAD_LEAD",
  "SALE_DONE",
]);

const dataSourceSchema = z.enum([
  "",
  "leads_on_demand",
  "meridian_tower",
  "eden_park",
  "varah_swamy",
  "sarjapur_plots",
]);

export const crmRecordSchema = z.object({
  created_at: z.string(),
  name: z.string(),
  email: z.string(),
  country_code: z.string(),
  mobile_without_country_code: z.string(),
  company: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  lead_owner: z.string(),
  crm_status: crmStatusSchema,
  crm_note: z.string(),
  data_source: dataSourceSchema,
  possession_time: z.string(),
  description: z.string(),
});

export const batchResultSchema = z.object({
  source_index: z.number().int(),
  record: crmRecordSchema.nullable(),
  skip_reason: z.string(),
});

export type CrmRecord = z.infer<typeof crmRecordSchema>;

export type SkippedRecord = {
  sourceIndex: number;
  source: Record<string, string>;
  reason: string;
};

export type ExtractionResult = {
  records: CrmRecord[];
  skippedRecords: SkippedRecord[];
};
