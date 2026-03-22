import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from "typeorm";
import type { Pipeline } from "./Pipeline.js";
import type { Delivery } from "./Delivery.js";

@Entity("jobs")
export class Job {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("jsonb", { nullable: false })
  payload!: Record<string, any>; 

  @Column({type: "varchar", default: "queued" })
  status!: string; 

  @Column({ type: "varchar", length: 1000, nullable: true })
  error!: string | null;

  @ManyToOne("Pipeline", (pipeline: Pipeline) => pipeline.jobs, { onDelete: "CASCADE" , nullable: false})
  pipeline!: Pipeline;

  @OneToMany("Delivery", (d: Delivery) => d.job)
deliveries!: Delivery[];

  @CreateDateColumn()
  created_at!: Date;

  @Column({type: "timestamp", nullable: true })
  processed_at!: Date; 
}
