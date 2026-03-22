import { Router } from "express";
import { getPipelines, createPipeline } from "./controller.js";

const router = Router();

router.get("/pipelines", getPipelines);          
router.post("/pipelines", createPipeline);      

export default router;