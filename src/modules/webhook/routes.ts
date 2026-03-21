import { Router } from "express";
import { handleWebhook } from "./controller.js";
const router = Router();

router.post("/webhook/*", handleWebhook); //dynamic route to handle all webhook POST requests

export default router;