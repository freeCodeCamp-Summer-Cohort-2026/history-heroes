import { Entity, PrimaryColumn, Column, Index } from 'typeorm';
import type { SessionData } from 'express-session';

@Entity('sessions')
export class SessionEntity {
  @PrimaryColumn('varchar', { length: 255 })
  id: string;

  @Index()
  @Column({ type: 'int', nullable: true })
  userId?: number | null; // Optional relation/index to User.id

  @Column('jsonb')
  data: SessionData | Record<string, any>;

  @Index()
  @Column('bigint')
  expiresAt: number;
}
