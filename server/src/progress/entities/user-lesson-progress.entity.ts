import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
} from 'typeorm';

@Entity('user_lesson_progress')
@Unique(['userId', 'lessonId'])
@Index(['userId', 'lessonId'])
@Index(['sessionId', 'lessonId'])
export class UserLessonProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  @Index()
  lessonId: string;

  @Column({ type: 'int', nullable: true })
  @Index()
  userId?: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Index()
  sessionId?: string | null;

  @CreateDateColumn()
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
