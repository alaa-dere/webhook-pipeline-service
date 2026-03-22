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

        const delivery = deliveryRepo.create({
          job,
          subscriber: sub,
          status: "pending",
          attempt_count: 0
        });

        await deliveryRepo.save(delivery);

        try {
          const response = await axios.post(sub.subscriber_url, result);

          delivery.status = "success";
          delivery.response = JSON.stringify(response.data);
          delivery.attempt_count = 1;
          delivery.last_attempt = new Date();

          console.log(`Sent to ${sub.subscriber_url}`);

        } catch (err: any) {
          delivery.status = "failed";
          delivery.response = err.message;
          delivery.attempt_count = 1;
          delivery.last_attempt = new Date();

          console.log(`Failed to send to ${sub.subscriber_url}`);
        }

        await deliveryRepo.save(delivery);
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