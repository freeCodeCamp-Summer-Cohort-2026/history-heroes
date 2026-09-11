import { Entity, PrimaryColumn, Column, Index } from 'typeorm';
import type { SessionData } from 'express-session';

@Entity('sessions')
export class SessionEntity {
  /**
   * The session id of the user.
   *
   * This is unique for all sessions, authenticated or not, and is the primary key for this table.
   */
  @Index()
  @PrimaryColumn('varchar', { length: 255 })
  id: string;

  /**
   * The user's id associated with this session, if any.
   * This is nullable as not all sessions are authenticated.
   */
  @Index()
  @Column({ type: 'int', nullable: true })
  userId?: number | null;

  /**
   * The session data will be saved here, as is the most common standard practice for express-session stores. This is a JSON object that contains the serialized session data, including the userId and any other session-specific information.
   */
  @Column('jsonb')
  data: SessionData | Record<string, any>;

  @Index()
  @Column('bigint')
  expiresAt: number;
}
