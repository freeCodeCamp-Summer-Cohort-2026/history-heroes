import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
} from 'typeorm';

@Entity('user_lab_progress')
@Unique(['userId', 'labId'])
@Index(['userId', 'labId'])
@Index(['sessionId', 'labId'])
export class UserLabProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  @Index()
  labId: string;

  @Column({ type: 'int', nullable: true })
  @Index()
  userId?: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Index()
  sessionId?: string | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
