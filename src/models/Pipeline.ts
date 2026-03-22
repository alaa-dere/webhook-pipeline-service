import { Entity, OneToMany, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import type { Subscriber } from "./Subscriber.js";
import type { Job } from "./Job.js";

@Entity()
export class Pipeline {
  @PrimaryGeneratedColumn()
  id!: number; 
  
  @Column({type: "varchar", length: 255})
  name!: string; 

  @Column({  type: "varchar", length: 500, unique: true })
  source_url!: string; 

  @Column({type: "varchar", length: 50})
  action_type!: string; 

  @OneToMany("Subscriber", (sub: Subscriber) => sub.pipeline, { cascade: true })
  subscribers!: Subscriber[];

  @OneToMany("Job", (job: Job) => job.pipeline)
  jobs!: Job[];

  @CreateDateColumn()
  created_at!: Date; 
}
