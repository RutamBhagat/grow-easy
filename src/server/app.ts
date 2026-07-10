import express from "express";

import { importRouter } from "@/server/routes/import";

export const app = express();

app.use("/api/import", importRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});
