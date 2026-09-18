import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { UserLessonProgress } from './entities/user-lesson-progress.entity';

@Injectable()
export class ProgressService implements OnModuleInit {
  private readonly logger = new Logger(ProgressService.name);
  private validLessonIds: Set<string> | null = null;

  constructor(
    @InjectRepository(UserLessonProgress)
    private readonly lessonProgressRepository: Repository<UserLessonProgress>,
    private readonly dataSource: DataSource,
  ) {}

  async onModuleInit() {
    await this.loadValidLessonIds();
  }

  private async loadValidLessonIds(): Promise<Set<string>> {
    if (this.validLessonIds) {
      return this.validLessonIds;
    }

    const possiblePaths = [
      path.resolve(process.cwd(), 'data/seeds/initial-lessons.json'),
      path.resolve(process.cwd(), 'server/data/seeds/initial-lessons.json'),
      path.resolve(__dirname, '../../data/seeds/initial-lessons.json'),
    ];

    for (const filePath of possiblePaths) {
      try {
        const raw = await fs.promises.readFile(filePath, 'utf-8');
        const data = JSON.parse(raw);
        if (Array.isArray(data?.lessons)) {
          this.validLessonIds = new Set(
            data.lessons.map((l: { id: string }) => l.id),
          );
          return this.validLessonIds;
        }
      } catch {
        // fallback to next path or default set
      }
    }

    this.validLessonIds = new Set([
      'great-pyramid',
      'hanging-gardens',
      'lighthouse-of-alexandria',
    ]);
    return this.validLessonIds;
  }

  /**
   * Helper to resolve known authored lesson IDs from seeds/config.
   */
  private getValidLessonIds(): Set<string> {
    if (this.validLessonIds) {
      return this.validLessonIds;
    }

    this.validLessonIds = new Set([
      'great-pyramid',
      'hanging-gardens',
      'lighthouse-of-alexandria',
    ]);
    return this.validLessonIds;
  }

  /**
   * Checks whether the specified lesson ID exists in the authored curriculum.
   */
  isValidLesson(lessonId: string): boolean {
    return this.getValidLessonIds().has(lessonId);
  }

  /**
   * Helper function used within recordLessonProgress, to
   * get the existing learning progress for the current user/session relative to the given lesson.
   *
   * This is to be used within a transaction to prevent a TOCTOU race
   */
  private async getExistingProgress(params: {
    repo: Repository<UserLessonProgress>;
    lessonId: string;
    userId?: number | null;
    sessionId?: string | null;
  }): Promise<UserLessonProgress | null> {
    const { repo, lessonId, userId, sessionId } = params;

    let existing: UserLessonProgress | null = null;

    if (userId) {
      existing = await repo.findOne({
        where: { lessonId, userId },
      });
    }

    if (!existing && sessionId) {
      existing = await repo.findOne({
        where: { lessonId, sessionId },
      });
    }

    if (!existing) {
      return null;
    }

    if (userId && !existing.userId) {
      // update the existing record to link it to the authenticated user
      existing.userId = userId;
      return await repo.save(existing);
    }

    return existing;
  }

  /**
   * Records completion of a lesson for the authenticated user and/or active session.
   * This operation is idempotent: repeating the request will not create duplicate progress records.
   */
  async recordLessonProgress(options: {
    lessonId: string;
    userId?: number | null;
    sessionId?: string | null;
  }): Promise<UserLessonProgress> {
    const { lessonId, userId, sessionId } = options;

    if (!lessonId || typeof lessonId !== 'string') {
      throw new BadRequestException('A valid lessonId must be provided');
    }

    if (!this.isValidLesson(lessonId)) {
      throw new NotFoundException(`Lesson with ID "${lessonId}" not found`);
    }

    if (!userId && !sessionId) {
      throw new UnauthorizedException('No active user or session found');
    }

    return await this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(UserLessonProgress);

      const existing: UserLessonProgress | null =
        await this.getExistingProgress({
          repo,
          lessonId,
          userId,
          sessionId,
        });

      if (existing) {
        return existing;
      }

      const newRecord = repo.create({
        lessonId,
        userId: userId ?? null,
        sessionId: sessionId ?? null,
        completedAt: new Date(),
      });

      try {
        return await repo.save(newRecord);
      } catch (error) {
        this.logger.error(error);
        // Handle TOCTOU race: concurrent request may have inserted in parallel
        if (userId) {
          const raceRecord = await repo.findOne({
            where: { lessonId, userId },
          });
          if (raceRecord) return raceRecord;
        }
        if (sessionId) {
          const raceRecord = await repo.findOne({
            where: { lessonId, sessionId },
          });
          if (raceRecord) return raceRecord;
        }
        throw new BadRequestException(
          'Failed to record lesson progress due to conflict',
        );
      }
    });
  }

  /**
   * Returns all progress for the current user's session and/or userId.
   * If the user is authenticated, unlinked progress belonging to the same session is linked to the user atomically.
   */
  async getProgress(options: {
    userId?: number | null;
    sessionId?: string | null;
  }): Promise<UserLessonProgress[]> {
    const { userId, sessionId } = options;

    if (!userId && !sessionId) {
      return [];
    }

    // Atomically link any unlinked session records to the authenticated user
    if (userId && sessionId) {
      await this.dataSource.transaction(async (manager) => {
        const repo = manager.getRepository(UserLessonProgress);
        const sessionRecords = await repo.find({
          where: { sessionId },
        });

        const unlinkedRecords = sessionRecords.filter((r) => !r.userId);
        if (unlinkedRecords.length === 0) {
          return;
        }

        const userRecords = await repo.find({
          where: { userId },
        });
        const existingLessonIds = new Set(userRecords.map((r) => r.lessonId));

        const recordsToSave: UserLessonProgress[] = [];
        const recordsToRemove: UserLessonProgress[] = [];

        for (const record of unlinkedRecords) {
          if (existingLessonIds.has(record.lessonId)) {
            // User already has a progress record for this lesson; prune duplicate session record
            recordsToRemove.push(record);
          } else {
            record.userId = userId;
            recordsToSave.push(record);
            existingLessonIds.add(record.lessonId);
          }
        }

        if (recordsToRemove.length > 0) {
          await repo.remove(recordsToRemove);
        }
        if (recordsToSave.length > 0) {
          await repo.save(recordsToSave);
        }
      });
    }

    const whereConditions: FindOptionsWhere<UserLessonProgress>[] = [];
    if (userId) {
      whereConditions.push({ userId });
    }
    if (sessionId) {
      whereConditions.push({ sessionId });
    }

    const records = await this.lessonProgressRepository.find({
      where: whereConditions,
      order: { completedAt: 'ASC' },
    });

    // Deduplicate by lessonId in case records exist for both sessionId and userId
    const uniqueMap = new Map<string, UserLessonProgress>();
    for (const record of records) {
      if (!uniqueMap.has(record.lessonId)) {
        uniqueMap.set(record.lessonId, record);
      }
    }

    return Array.from(uniqueMap.values());
  }

  /**
   * Returns completion status for a specific lesson for the given user/session, if any.
   */
  async getLessonProgress(options: {
    lessonId: string;
    userId?: number | null;
    sessionId?: string | null;
  }): Promise<UserLessonProgress | null> {
    const { lessonId, userId, sessionId } = options;

    if (!lessonId || typeof lessonId !== 'string') {
      throw new BadRequestException('A valid lessonId must be provided');
    }

    if (!this.isValidLesson(lessonId)) {
      throw new NotFoundException(`Lesson with ID "${lessonId}" not found`);
    }

    if (userId) {
      const record = await this.lessonProgressRepository.findOne({
        where: { lessonId, userId },
      });
      if (record) return record;
    }

    if (sessionId) {
      return await this.lessonProgressRepository.findOne({
        where: { lessonId, sessionId },
      });
    }

    return null;
  }
}
