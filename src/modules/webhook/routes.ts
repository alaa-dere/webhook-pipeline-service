import { Router } from "express";
import { handleWebhook } from "./controller.js";
const router = Router();

router.post("/webhook/:pipelineId", handleWebhook);
export default router;