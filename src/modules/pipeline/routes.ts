import { Router } from "express";
import {
  getPipelines,
  getPipelineById,
  createPipeline,
  updatePipeline,
  deletePipeline
} from "./controller.js";

const router = Router();

router.get("/pipelines", getPipelines);          
router.post("/pipelines", createPipeline);      
router.get("/pipelines/:id", getPipelineById);
router.patch("/pipelines/:id", updatePipeline);
router.delete("/pipelines/:id", deletePipeline);

export default router;
