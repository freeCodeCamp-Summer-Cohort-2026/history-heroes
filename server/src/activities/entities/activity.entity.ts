import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import {
  ActivityContent,
  ActivitySuccessCriteria,
  ActivityType,
} from '../types/activity.types';

@Entity('activities')
export class Activity {
  @PrimaryColumn({ type: 'varchar', length: 100 })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ name: 'activity_type', type: 'varchar', length: 50 })
  type: ActivityType;

  get activityType(): ActivityType {
    return this.type;
  }

  set activityType(value: ActivityType) {
    this.type = value;
  }

  @Column({ name: 'check_statement', type: 'text' })
  checkStatement: string;

  @Column('jsonb')
  content: ActivityContent;

  @Column('jsonb', { name: 'success_criteria' })
  successCriteria: ActivitySuccessCriteria;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
