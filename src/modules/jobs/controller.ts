// src/modules/jobs/jobs.controller.ts
import type { Request, Response } from "express";
import { AppDataSource } from "../../db/data-source.js";
import { Job } from "../../models/Job.js";
import { Delivery } from "../../models/Delivery.js";

export const getJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await AppDataSource.getRepository(Job).find({
      relations: ["pipeline", "deliveries", "deliveries.subscriber"],
      order: { created_at: "DESC" }, 
    });

    res.json(jobs);
  } catch (err: any) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ error: "Error fetching jobs" });
  }
};

export const getJobById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: "invalid job id" });
    }

    const job = await AppDataSource.getRepository(Job).findOne({
      where: { id },
      relations: ["pipeline", "deliveries", "deliveries.subscriber"],
    });
    if (!job) return res.status(404).json({ error: "Job not found" });

    res.json(job);
  } catch (err: any) {
    console.error("Error fetching job:", err);
    res.status(500).json({ error: "Error fetching job" });
  }
};

export const getJobDeliveries = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: "invalid job id" });
    }

    const job = await AppDataSource.getRepository(Job).findOneBy({ id });
    if (!job) return res.status(404).json({ error: "Job not found" });

    const deliveries = await AppDataSource.getRepository(Delivery).find({
      where: { job: { id } },
      relations: ["subscriber", "job"],
      order: { last_attempt: "DESC" },
    });

    res.json(deliveries);
  } catch (err: any) {
    console.error("Error fetching job deliveries:", err);
    res.status(500).json({ error: "Error fetching job deliveries" });
  }
};
