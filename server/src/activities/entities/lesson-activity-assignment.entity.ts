import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
  Index,
} from 'typeorm';

@Entity('lesson_activity_assignments')
@Unique(['lessonId', 'orderIndex'])
@Index(['lessonId', 'orderIndex'])
export class LessonActivityAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'lesson_id', type: 'varchar', length: 100 })
  lessonId: string;

  @Column({ name: 'activity_id', type: 'varchar', length: 100 })
  activityId: string;

  @Column({ name: 'order_index', type: 'integer' })
  orderIndex: number;

  @CreateDateColumn()
  createdAt: Date;
}
