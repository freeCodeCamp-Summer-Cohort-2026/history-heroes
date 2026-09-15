import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { Module } from './module.entity';

@Entity('lessons')
@Unique('UQ_lessons_module_order_index', ['moduleId', 'orderIndex'])
export class Lesson {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ name: 'moduleId', type: 'varchar', length: 50 })
  moduleId: string;

  @ManyToOne(() => Module, (module) => module.lessons, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'moduleId' })
  module: Module;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'text' })
  contents: string;

  @Column({ name: 'orderIndex', type: 'integer' })
  orderIndex: number;
}