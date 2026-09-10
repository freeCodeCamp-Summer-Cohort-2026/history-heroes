import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store, SessionData } from 'express-session';
import { Repository, LessThan } from 'typeorm';
import { SessionEntity } from './entities/session.entity';

/**
 * The session store uses nest patterns, but implements a custom
 * express-session store relying on the existing typeorm connection.
 */
@Injectable()
export class SessionStoreService
  extends Store
  implements OnModuleInit, OnModuleDestroy
{
  private cleanupTimer?: NodeJS.Timeout;

  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepo: Repository<SessionEntity>,
  ) {
    super();
  }

  async get(
    sid: string,
    callback: (err?: any, session?: SessionData | null) => void,
  ) {
    try {
      const session = await this.sessionRepo.findOneBy({ id: sid });
      if (!session || Date.now() > session.expiresAt) {
        return callback(null, null);
      }
      const data =
        typeof session.data === 'string'
          ? (JSON.parse(session.data) as SessionData)
          : (session.data as SessionData);
      return callback(null, data);
    } catch (err) {
      return callback(err);
    }
  }

  async set(sid: string, session: SessionData, callback?: (err?: any) => void) {
    try {
      const maxAge = session.cookie?.maxAge ?? 86400 * 1000;
      const expiresAt = Date.now() + maxAge;

      await this.sessionRepo.save({
        id: sid,
        data: session,
        expiresAt,
      });
      callback?.(null);
    } catch (err) {
      callback?.(err);
    }
  }

  async destroy(sid: string, callback?: (err?: any) => void) {
    try {
      await this.sessionRepo.delete({ id: sid });
      callback?.(null);
    } catch (err) {
      callback?.(err);
    }
  }

  async touch(
    sid: string,
    session: SessionData,
    callback?: (err?: any) => void,
  ) {
    await this.set(sid, session, callback);
  }

  onModuleInit() {
    // Prune expired sessions every 15 minutes
    this.cleanupTimer = setInterval(
      async () => {
        try {
          await this.sessionRepo.delete({ expiresAt: LessThan(Date.now()) });
        } catch {
          // Suppress cleanup error logging if DB is temporarily busy
        }
      },
      15 * 60 * 1000,
    );
  }

  onModuleDestroy() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
  }
}
