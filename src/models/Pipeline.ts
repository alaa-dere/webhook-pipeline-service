import { Entity, OneToMany, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { Subscriber } from "./Subscriber.js";
import { Job } from "./Job.js";

@Entity()
export class Pipeline {
  @PrimaryGeneratedColumn()
  id!: number; 
  
  @Column()
  name!: string; 

  @Column({ unique: true })
  source_url!: string; 

  @Column()
  action_type!: string; 

  @OneToMany(() => Subscriber, (sub) => sub.pipeline, { cascade: true })
  subscribers!: Subscriber[];

  @OneToMany(() => Job, (job) => job.pipeline)
  jobs!: Job[];

  @CreateDateColumn()
  created_at!: Date; 
}