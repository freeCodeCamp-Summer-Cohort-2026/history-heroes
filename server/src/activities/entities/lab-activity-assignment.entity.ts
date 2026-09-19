import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Lab } from '../../labs/entities/lab.entity';
import { Activity } from './activity.entity';

@Entity('lab_activity_assignments')
@Index(['labId', 'activityId'])
export class LabActivityAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'lab_id', type: 'varchar', length: 100 })
  labId: string;

  @ManyToOne(() => Lab, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lab_id' })
  lab: Lab;

  @Column({ name: 'activity_id', type: 'varchar', length: 100 })
  activityId: string;

  @ManyToOne(() => Activity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'activity_id' })
  activity: Activity;

  @CreateDateColumn()
  createdAt: Date;
}
