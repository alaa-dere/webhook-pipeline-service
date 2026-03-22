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

export const getPipelineById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: "invalid pipeline id" });
    }

    const pipeline = await pipelineService.getById(id);
    if (!pipeline) return res.status(404).json({ error: "Pipeline not found" });

    res.json(pipeline);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "error while fetching pipeline" });
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

export const updatePipeline = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: "invalid pipeline id" });
    }

    const updated = await pipelineService.update(id, req.body);
    if (!updated) return res.status(404).json({ error: "Pipeline not found" });

    res.json(updated);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

export const deletePipeline = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: "invalid pipeline id" });
    }

    const removed = await pipelineService.remove(id);
    if (!removed) return res.status(404).json({ error: "Pipeline not found" });

    res.json({ success: true });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "error while deleting pipeline" });
  }
};
