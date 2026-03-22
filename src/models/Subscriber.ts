import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from "typeorm";
import type { Pipeline } from "./Pipeline.js";
import type { Delivery } from "./Delivery.js";

@Entity()
export class Subscriber {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({type: "varchar", length: 500 })
  subscriber_url!: string; 

@ManyToOne("Pipeline", (pipeline: Pipeline) => pipeline.subscribers, {
  onDelete: "CASCADE",
  nullable: false,
})
pipeline!: Pipeline;

@OneToMany("Delivery", (d: Delivery) => d.subscriber)
deliveries!: Delivery[];

  @CreateDateColumn()
  created_at!: Date;
}
