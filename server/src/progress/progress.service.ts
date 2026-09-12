import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { UserLessonProgress } from './entities/user-lesson-progress.entity';

@Injectable()
export class ProgressService {
  private validLessonIds: Set<string> | null = null;

  constructor(
    @InjectRepository(UserLessonProgress)
    private readonly lessonProgressRepository: Repository<UserLessonProgress>,
  ) {}

  /**
   * Helper to resolve known authored lesson IDs from seeds/config.
   */
  private getValidLessonIds(): Set<string> {
    if (this.validLessonIds) {
      return this.validLessonIds;
    }

    const possiblePaths = [
      path.resolve(process.cwd(), 'data/seeds/initial-lessons.json'),
      path.resolve(process.cwd(), 'server/data/seeds/initial-lessons.json'),
      path.resolve(__dirname, '../../data/seeds/initial-lessons.json'),
    ];

    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        try {
          const raw = fs.readFileSync(filePath, 'utf-8');
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

    let existing: UserLessonProgress | null = null;

    if (userId) {
      existing = await this.lessonProgressRepository.findOne({
        where: { lessonId, userId },
      });
    }

    if (!existing && sessionId) {
      existing = await this.lessonProgressRepository.findOne({
        where: { lessonId, sessionId },
      });
    }

    if (existing) {
      // If found via session and the user is now authenticated, link user to the existing record
      if (userId && !existing.userId) {
        existing.userId = userId;
        return await this.lessonProgressRepository.save(existing);
      }
      return existing;
    }

    const newRecord = this.lessonProgressRepository.create({
      lessonId,
      userId: userId ?? null,
      sessionId: sessionId ?? null,
      completedAt: new Date(),
    });

    return await this.lessonProgressRepository.save(newRecord);
  }

  /**
   * Returns all progress for the current user's session and/or userId.
   * If the user is authenticated, unlinked progress belonging to the same session is linked to the user.
   */
  async getProgress(options: {
    userId?: number | null;
    sessionId?: string | null;
  }): Promise<UserLessonProgress[]> {
    const { userId, sessionId } = options;

    if (!userId && !sessionId) {
      return [];
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

    if (userId) {
      // Link any records belonging to this session that lack userId
      for (const record of records) {
        if (!record.userId) {
          record.userId = userId;
          await this.lessonProgressRepository.save(record);
        }
      }
    }

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
