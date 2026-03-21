import { AppDataSource } from "../../db/data-source.js";
import { Job } from "../../models/Job.js";
import { Pipeline } from "../../models/Pipeline.js";

export const webhookService = {
  async queueWebhook(sourcePath: string, payload: unknown) {
    const pipelineRepo = AppDataSource.getRepository(Pipeline);
    const jobRepo = AppDataSource.getRepository(Job);

    const pipeline = await pipelineRepo.findOne({
      where: { source_url: sourcePath },
    });

    if (!pipeline) throw new Error("Pipeline not found");

    //if (!pipeline.is_active) throw new Error("Pipeline is inactive");

    const job = jobRepo.create({
      pipeline: pipeline,
      payload: payload as Record<string, any>,
      status: "queued" as const,
    });

return await jobRepo.save(job);
  },
};