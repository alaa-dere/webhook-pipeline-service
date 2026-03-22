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
    try {
      const job = await jobRepo.findOne({
        where: { status: "queued" },
        relations: ["pipeline"]
      });

      if (!job) return;

      console.log(`Processing job #${job.id}`);

      job.status = "processing";
      await jobRepo.save(job);

      const result = processData(job.payload, job.pipeline.action_type);

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
      const response = await axios.post(sub.subscriber_url, result);

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
        await new Promise(res => setTimeout(res, 2000));
      }
    }
  }
}

      job.status = result === null ? "skipped" : "completed";
      job.processed_at = new Date();

      await jobRepo.save(job);

      console.log(`Job #${job.id} done`);

    } catch (err) {
      console.error("Worker error:", err);
    }

  }, 5000); //check every 5 seconds
};