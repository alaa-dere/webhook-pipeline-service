import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import type { Job } from "./Job.js";
import type { Subscriber } from "./Subscriber.js";
@Entity()
export class Delivery {
  @PrimaryGeneratedColumn()
  id!: number;

@ManyToOne("Job", (job: Job) => job.deliveries, { onDelete: "CASCADE" })
job!: Job;

@ManyToOne("Subscriber", (sub: Subscriber) => sub.deliveries, { onDelete: "CASCADE" })
subscriber!: Subscriber;

  @Column({type: "varchar", default: "pending" })
  status!: string; 

  @Column({type: "integer", default: 0 })
  attempt_count!: number;

  @Column({type: "timestamp", nullable: true })
  last_attempt!: Date;

  @Column({type: "varchar", nullable: true })
  response!: string;

  @CreateDateColumn()
  created_at!: Date;
}
