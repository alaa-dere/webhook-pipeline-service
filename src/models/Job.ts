import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from "typeorm";
import { Pipeline } from "./Pipeline.js";
import { Delivery } from "./Delivery.js";

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("jsonb", { nullable: false })
  payload!: Record<string, any>; 

  @Column({ default: "queued" })
  status!: string; 

  @ManyToOne(() => Pipeline, (pipeline) => pipeline.jobs, { onDelete: "CASCADE" , nullable: false})
  pipeline!: Pipeline;

  @OneToMany(() => Delivery, (d) => d.job)
deliveries!: Delivery[];

  @CreateDateColumn()
  created_at!: Date;

  @Column({ nullable: true })
  processed_at!: Date; 
}