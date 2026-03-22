// src/modules/pipeline/pipeline.service.ts
import { AppDataSource } from "../../db/data-source.js";
import { Pipeline } from "../../models/Pipeline.js";

export const pipelineService = {
  async getAll() {
    const repo = AppDataSource.getRepository(Pipeline);
    return await repo.find({
      relations: ["subscribers"],  
      order: { created_at: "DESC" }
    });
  },

  async create(data: any) {
    const repo = AppDataSource.getRepository(Pipeline);

    const pipeline = repo.create({
      name: data.name,
      source_url: data.source_url,
      action_type: data.action_type,
    //  is_active: data.is_active ?? true,
      subscribers: data.subscribers || []   
    });

    return await repo.save(pipeline);
  }
};