import "reflect-metadata";
import { DataSource } from "typeorm";
import { Pipeline } from "../models/Pipeline.js";
import { Subscriber } from "../models/Subscriber.js";
import { Job } from "../models/Job.js";
import { Delivery } from "../models/Delivery.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "postgres",  
  port: 5432,
  username: "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: "webhook_db",
  synchronize: true,
  logging: false,
  entities: [Pipeline, Subscriber, Job, Delivery],
});