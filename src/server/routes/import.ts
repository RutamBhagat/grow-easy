import { createReadStream } from "node:fs";
import { unlink } from "node:fs/promises";
import { tmpdir } from "node:os";

import { parse } from "csv-parse";
import { Router } from "express";
import multer from "multer";

export const importRouter = Router();

const upload = multer({
  dest: tmpdir(),
  limits: { fileSize: 4.5 * 1024 * 1024 },
});

importRouter.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "CSV file is required" });
    return;
  }

  try {
    const parser = createReadStream(req.file.path).pipe(
      parse({
        bom: true,
        columns: true,
        skip_empty_lines: true,
        trim: true,
      }),
    );

    let rowCount = 0;

    for await (const record of parser) {
      console.log("Parsed CSV record:", record);
      rowCount += 1;
    }

    res.json({ message: "CSV parsed successfully", rowCount });
  } catch {
    res.status(400).json({ error: "Invalid CSV file" });
  } finally {
    await unlink(req.file.path).catch(() => undefined);
  }
});
