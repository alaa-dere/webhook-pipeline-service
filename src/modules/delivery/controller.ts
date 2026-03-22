import type { Request, Response } from "express";
import { AppDataSource } from "../../db/data-source.js";
import { Delivery } from "../../models/Delivery.js";

export const getDeliveries = async (req: Request, res: Response) => {
  try {
    const deliveries = await AppDataSource.getRepository(Delivery).find({
      relations: ["job", "subscriber", "job.pipeline"],
      order: { last_attempt: "DESC" }
    });

    res.json(deliveries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching deliveries" });
  }
};