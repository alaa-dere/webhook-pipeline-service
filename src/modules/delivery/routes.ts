import { Router } from "express";
import { getDeliveries } from "./controller.js";

const router = Router();

router.get("/deliveries", getDeliveries);

export default router;