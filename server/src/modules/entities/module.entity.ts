import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Lesson } from './lesson.entity';

@Entity('modules')
export class Module {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  period: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  theme: string | null;

  @Column({ type: 'integer', default: 0 })
  order: number;

  @OneToMany(() => Lesson, (lesson) => lesson.module)
  lessons: Lesson[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
