import { Router } from "express";
import multer from "multer";

import { extractCrmRecords } from "@/server/ai/extract-crm-records";
import { parseCsv } from "@/server/csv/parse-csv";

export const importRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4.5 * 1024 * 1024 },
});

importRouter.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "CSV file is required" });
    return;
  }

  try {
    const sourceRecords = await parseCsv({ buffer: req.file.buffer });
    const { records, skippedRecords } = await extractCrmRecords({
      sourceRecords,
    });

    res.json({
      records,
      skippedRecords,
      totalImported: records.length,
      totalSkipped: skippedRecords.length,
    });
  } catch (error) {
    console.error("CSV import failed:", error);
    res.status(500).json({ error: "Could not extract CRM records" });
  }
});
