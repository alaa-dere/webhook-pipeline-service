import type { Request, Response } from "express";
import { AppDataSource } from "../../db/data-source.js";
import { Subscriber } from "../../models/Subscriber.js";
import { Pipeline } from "../../models/Pipeline.js";

export const addSubscriber = async (req: Request, res: Response) => {
  try {
    const { pipelineId, subscriberUrl } = req.body;

    if (!pipelineId || !subscriberUrl) {
      return res.status(400).json({ error: "required pipelineId and subscriberUrl " });
    }

    const pipeline = await AppDataSource.getRepository(Pipeline).findOneBy({ id: pipelineId });
    if (!pipeline) {
      return res.status(404).json({ error: "Pipeline not found" });
    }

    const subscriberRepo = AppDataSource.getRepository(Subscriber);
    const newSubscriber = subscriberRepo.create({
      subscriber_url: subscriberUrl,
      pipeline: pipeline,            
    });

    await subscriberRepo.save(newSubscriber);

    res.json({ success: true, subscriber: newSubscriber });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getSubscribers = async (req: Request, res: Response) => {
  try {
    const subscribers = await AppDataSource.getRepository(Subscriber).find({
      relations: ["pipeline"],
      order: { created_at: "DESC" },
    });
    res.json(subscribers);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteSubscriber = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: "invalid subscriber id" });
    }

    const repo = AppDataSource.getRepository(Subscriber);
    const subscriber = await repo.findOneBy({ id });
    if (!subscriber) return res.status(404).json({ error: "Subscriber not found" });

    await repo.remove(subscriber);
    res.json({ success: true });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
