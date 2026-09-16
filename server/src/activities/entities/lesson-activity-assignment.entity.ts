import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Activity } from './activity.entity';
import { Lesson } from '../../lessons/entities/lesson.entity';

@Entity('lesson_activity_assignments')
@Unique(['lessonId', 'orderIndex'])
@Index(['lessonId', 'orderIndex'])
export class LessonActivityAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Lesson, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;

  @Column({ name: 'lesson_id', type: 'varchar', length: 100 })
  lessonId: string;

  @ManyToOne(() => Activity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'activity_id' })
  activity: Activity;

  @Column({ name: 'activity_id', type: 'varchar', length: 100 })
  activityId: string;

  @Column({ name: 'order_index', type: 'integer' })
  orderIndex: number;

  @CreateDateColumn()
  createdAt: Date;
}
