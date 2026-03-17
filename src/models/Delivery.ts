import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Job } from "./Job.js";
import { Subscriber } from "./Subscriber.js";
@Entity()
export class Delivery {
  @PrimaryGeneratedColumn()
  id!: number;

@ManyToOne(() => Job, (job) => job.deliveries, { onDelete: "CASCADE" })
job!: Job;

@ManyToOne(() => Subscriber, (sub) => sub.deliveries, { onDelete: "CASCADE" })
subscriber!: Subscriber;

  @Column({ default: "pending" })
  status!: string; 

  @Column({ default: 0 })
  attempt_count!: number;

  @Column({ nullable: true })
  last_attempt!: Date;

  @Column({ nullable: true })
  response!: string;

  @CreateDateColumn()
  created_at!: Date;
}