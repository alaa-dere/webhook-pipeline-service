// src/modules/jobs/jobs.controller.ts
import type { Request, Response } from "express";
import { AppDataSource } from "../../db/data-source.js";
import { Job } from "../../models/Job.js";

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