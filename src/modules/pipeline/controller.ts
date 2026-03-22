// src/modules/pipeline/pipeline.controller.ts
import type { Request, Response } from "express";
import { pipelineService } from "./service.js";

export const getPipelines = async (req: Request, res: Response) => {
  try {
    const pipelines = await pipelineService.getAll();
    res.json(pipelines);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "error while fetching pipelines" });
  }
};

export const createPipeline = async (req: Request, res: Response) => {
  try {
    const pipeline = await pipelineService.create(req.body);
    res.status(201).json(pipeline);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};