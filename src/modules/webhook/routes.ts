import { Router } from "express";
import { handleWebhook } from "./controller.js";
const router = Router();

router.post("/webhook/:sourceUrl", handleWebhook);
export default router;