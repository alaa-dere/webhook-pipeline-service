import type { Request, Response } from "express";
import { webhookService } from "./service.js";

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const fullPath = req.path.replace(/^\/webhook\//, "/");

    const job = await webhookService.queueWebhook(fullPath, req.body);

    return res.status(202).json({
      message: "Webhook accepted and queued",
      jobId: job.id,
    });
  } catch (err: any) {
    console.error("Webhook error:", err);

    if (err.message?.includes("Pipeline not found")) {
      return res.status(404).json({ error: "Pipeline not found for this URL" });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
};