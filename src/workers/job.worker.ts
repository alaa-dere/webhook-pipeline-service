import axios from "axios";
import { AppDataSource } from "../db/data-source.js";
import { Job } from "../models/Job.js";
import { Delivery } from "../models/Delivery.js";
import { Subscriber } from "../models/Subscriber.js";

const processData = (payload: any, action_type: string) => {
  switch (action_type) {
    case "uppercase":
      return {
        ...payload,
        message: String(payload.message || "").toUpperCase()
      };

    case "add_timestamp":
      return {
        ...payload,
        processed_at: new Date().toISOString()
      };

    case "filter":
      return payload.value > 50 ? payload : null;

    default:
      return payload;
  }
};

export const startWorker = async () => {
  console.log("Worker started...");

  const jobRepo = AppDataSource.getRepository(Job);
  const subscriberRepo = AppDataSource.getRepository(Subscriber);
  const deliveryRepo = AppDataSource.getRepository(Delivery);

  setInterval(async () => {
    let currentJob: Job | null = null;
    try {
      const job = await AppDataSource.transaction(async (manager) => {
        const lockedJob = await manager
          .getRepository(Job)
          .createQueryBuilder("job")
          .setLock("pessimistic_write")
          .setOnLocked("skip_locked")
          .leftJoinAndSelect("job.pipeline", "pipeline")
          .where("job.status = :status", { status: "queued" })
          .orderBy("job.id", "ASC")
          .getOne();

        if (!lockedJob) return null;

        lockedJob.status = "processing";
        lockedJob.error = null;
        return await manager.getRepository(Job).save(lockedJob);
      });

      if (!job) return;

      currentJob = job;
      console.log(`Processing job #${job.id}`);

      const result = processData(job.payload, job.pipeline.action_type);

      if (result === null) {
        job.status = "skipped";
        job.processed_at = new Date();
        await jobRepo.save(job);
        console.log(`Job #${job.id} skipped`);
        return;
      }

      const subscribers = await subscriberRepo.find({
        where: { pipeline: { id: job.pipeline.id } }
      });

    for (const sub of subscribers) {
  let attempts = 0;
  let success = false;
  let lastError = "";

  while (attempts < 3 && !success) {
    attempts++;

    try {
      const response = await axios.post(sub.subscriber_url, result, {
        timeout: 5000,
      });

      const delivery = deliveryRepo.create({
        job,
        subscriber: sub,
        status: "success",
        attempt_count: attempts,
        response: JSON.stringify(response.data),
        last_attempt: new Date()
      });

      await deliveryRepo.save(delivery);

      console.log(`Success after ${attempts} attempt(s)`);

      success = true;

    } catch (err: any) {
      lastError = err.message;

      console.log(`Attempt ${attempts} failed for ${sub.subscriber_url}`);

      if (attempts === 3) {
        const delivery = deliveryRepo.create({
          job,
          subscriber: sub,
          status: "failed",
          attempt_count: attempts,
          response: lastError,
          last_attempt: new Date()
        });

        await deliveryRepo.save(delivery);
      } else {
        const backoffMs = 2000 * Math.pow(2, attempts - 1);
        await new Promise(res => setTimeout(res, backoffMs));
      }
    }
  }
}

      job.status = "completed";
      job.processed_at = new Date();

      await jobRepo.save(job);

      console.log(`Job #${job.id} done`);

    } catch (err: any) {
      console.error("Worker error:", err);
      try {
        const message = typeof err?.message === "string" ? err.message : "Worker error";
        if (currentJob) {
          currentJob.status = "failed";
          currentJob.error = message;
          currentJob.processed_at = new Date();
          await jobRepo.save(currentJob);
        }
      } catch (innerErr) {
        console.error("Failed to mark job as failed:", innerErr);
      }
    }

  }, 5000); //check every 5 seconds
};
