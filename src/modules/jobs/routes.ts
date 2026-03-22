import { Router } from "express";
import { getJobs, getJobById, getJobDeliveries } from "./controller.js";

const router = Router();

router.get("/jobs", getJobs);
router.get("/jobs/:id", getJobById);
router.get("/jobs/:id/deliveries", getJobDeliveries);

export default router;
