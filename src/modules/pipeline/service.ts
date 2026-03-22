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

  async getById(id: number) {
    const repo = AppDataSource.getRepository(Pipeline);
    return await repo.findOne({
      where: { id },
      relations: ["subscribers", "jobs"],
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
  },

  async update(id: number, data: any) {
    const repo = AppDataSource.getRepository(Pipeline);
    const pipeline = await repo.findOneBy({ id });
    if (!pipeline) return null;

    if (typeof data.name === "string") pipeline.name = data.name;
    if (typeof data.source_url === "string") pipeline.source_url = data.source_url;
    if (typeof data.action_type === "string") pipeline.action_type = data.action_type;

    return await repo.save(pipeline);
  },

  async remove(id: number) {
    const repo = AppDataSource.getRepository(Pipeline);
    const pipeline = await repo.findOneBy({ id });
    if (!pipeline) return null;

    await repo.remove(pipeline);
    return pipeline;
  },
};
