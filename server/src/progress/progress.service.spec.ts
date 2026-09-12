import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ProgressService } from './progress.service';
import { UserLessonProgress } from './entities/user-lesson-progress.entity';

describe('ProgressService', () => {
  let service: ProgressService;

  const mockLessonProgressRepository = {
    findOne: vi.fn(),
    find: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgressService,
        {
          provide: getRepositoryToken(UserLessonProgress),
          useValue: mockLessonProgressRepository,
        },
      ],
    }).compile();

    service = module.get<ProgressService>(ProgressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('recordLessonProgress', () => {
    it('should throw BadRequestException if lessonId is empty', async () => {
      await expect(
        service.recordLessonProgress({ lessonId: '', userId: 1 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if lessonId is not a known authored lesson', async () => {
      await expect(
        service.recordLessonProgress({
          lessonId: 'nonexistent-lesson-slug',
          userId: 1,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if neither userId nor sessionId is provided', async () => {
      await expect(
        service.recordLessonProgress({ lessonId: 'great-pyramid' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should create and return a new progress record for an authenticated user', async () => {
      mockLessonProgressRepository.findOne.mockResolvedValue(null);
      const createdEntity = {
        id: 1,
        lessonId: 'great-pyramid',
        userId: 42,
        sessionId: 'sess-123',
        completedAt: new Date(),
      };
      mockLessonProgressRepository.create.mockReturnValue(createdEntity);
      mockLessonProgressRepository.save.mockResolvedValue(createdEntity);

      const result = await service.recordLessonProgress({
        lessonId: 'great-pyramid',
        userId: 42,
        sessionId: 'sess-123',
      });

      expect(result).toEqual(createdEntity);
      expect(mockLessonProgressRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          lessonId: 'great-pyramid',
          userId: 42,
          sessionId: 'sess-123',
        }),
      );
      expect(mockLessonProgressRepository.save).toHaveBeenCalledWith(createdEntity);
    });

    it('should create and return a new progress record for an anonymous session', async () => {
      mockLessonProgressRepository.findOne.mockResolvedValue(null);
      const createdEntity = {
        id: 2,
        lessonId: 'hanging-gardens',
        userId: null,
        sessionId: 'sess-anon',
        completedAt: new Date(),
      };
      mockLessonProgressRepository.create.mockReturnValue(createdEntity);
      mockLessonProgressRepository.save.mockResolvedValue(createdEntity);

      const result = await service.recordLessonProgress({
        lessonId: 'hanging-gardens',
        sessionId: 'sess-anon',
      });

      expect(result).toEqual(createdEntity);
      expect(mockLessonProgressRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          lessonId: 'hanging-gardens',
          userId: null,
          sessionId: 'sess-anon',
        }),
      );
    });

    it('should return existing record idempotently without creating a duplicate', async () => {
      const existing = {
        id: 1,
        lessonId: 'great-pyramid',
        userId: 42,
        sessionId: 'sess-123',
        completedAt: new Date(),
      };
      mockLessonProgressRepository.findOne.mockResolvedValue(existing);

      const result = await service.recordLessonProgress({
        lessonId: 'great-pyramid',
        userId: 42,
      });

      expect(result).toBe(existing);
      expect(mockLessonProgressRepository.create).not.toHaveBeenCalled();
    });

    it('should link existing session record to user when user is newly authenticated', async () => {
      const existing = {
        id: 1,
        lessonId: 'great-pyramid',
        userId: null,
        sessionId: 'sess-123',
        completedAt: new Date(),
      };
      mockLessonProgressRepository.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(existing);
      mockLessonProgressRepository.save.mockImplementation((item) => Promise.resolve(item));

      const result = await service.recordLessonProgress({
        lessonId: 'great-pyramid',
        userId: 42,
        sessionId: 'sess-123',
      });

      expect(result.userId).toBe(42);
      expect(mockLessonProgressRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1, userId: 42 }),
      );
    });
  });

  describe('getProgress (learner isolation)', () => {
    it('should return empty array if neither userId nor sessionId is present', async () => {
      const result = await service.getProgress({});
      expect(result).toEqual([]);
    });

    it('should isolate progress: only query for the specific requested userId', async () => {
      const user1Records = [
        { id: 1, lessonId: 'great-pyramid', userId: 101, sessionId: null },
      ];
      mockLessonProgressRepository.find.mockResolvedValue(user1Records);

      const result = await service.getProgress({ userId: 101 });
      expect(result).toEqual(user1Records);
      expect(mockLessonProgressRepository.find).toHaveBeenCalledWith({
        where: [{ userId: 101 }],
        order: { completedAt: 'ASC' },
      });
    });

    it('should isolate progress between two different users', async () => {
      // Setup Learner A and Learner B
      mockLessonProgressRepository.find.mockImplementation((query) => {
        const userId = query.where[0].userId;
        if (userId === 1) {
          return Promise.resolve([
            { id: 1, lessonId: 'great-pyramid', userId: 1, sessionId: null },
          ]);
        }
        if (userId === 2) {
          return Promise.resolve([
            { id: 2, lessonId: 'hanging-gardens', userId: 2, sessionId: null },
          ]);
        }
        return Promise.resolve([]);
      });

      const learnerAProgress = await service.getProgress({ userId: 1 });
      const learnerBProgress = await service.getProgress({ userId: 2 });

      expect(learnerAProgress).toHaveLength(1);
      expect(learnerAProgress[0].lessonId).toBe('great-pyramid');

      expect(learnerBProgress).toHaveLength(1);
      expect(learnerBProgress[0].lessonId).toBe('hanging-gardens');

      expect(learnerAProgress).not.toEqual(learnerBProgress);
    });

    it('should return progress records for an authenticated user and link session records', async () => {
      const records = [
        { id: 1, lessonId: 'great-pyramid', userId: 42, sessionId: 'sess-1' },
        { id: 2, lessonId: 'hanging-gardens', userId: null, sessionId: 'sess-1' },
      ];
      mockLessonProgressRepository.find.mockResolvedValue(records);
      mockLessonProgressRepository.save.mockImplementation((item) => Promise.resolve(item));

      const result = await service.getProgress({ userId: 42, sessionId: 'sess-1' });

      expect(result).toHaveLength(2);
      expect(records[1].userId).toBe(42);
      expect(mockLessonProgressRepository.save).toHaveBeenCalledWith(records[1]);
    });

    it('should deduplicate progress items by lessonId', async () => {
      const records = [
        { id: 1, lessonId: 'great-pyramid', userId: 42, sessionId: 'sess-1' },
        { id: 2, lessonId: 'great-pyramid', userId: 42, sessionId: 'sess-2' },
      ];
      mockLessonProgressRepository.find.mockResolvedValue(records);

      const result = await service.getProgress({ userId: 42 });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });
  });

  describe('getLessonProgress', () => {
    it('should throw NotFoundException if lesson does not exist', async () => {
      await expect(
        service.getLessonProgress({
          lessonId: 'invalid-lesson',
          userId: 42,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return null if no progress is found for a valid lesson', async () => {
      mockLessonProgressRepository.findOne.mockResolvedValue(null);

      const result = await service.getLessonProgress({
        lessonId: 'great-pyramid',
        userId: 42,
      });

      expect(result).toBeNull();
    });

    it('should return record if found by userId', async () => {
      const record = { id: 1, lessonId: 'great-pyramid', userId: 42 };
      mockLessonProgressRepository.findOne.mockResolvedValue(record);

      const result = await service.getLessonProgress({
        lessonId: 'great-pyramid',
        userId: 42,
      });

      expect(result).toEqual(record);
    });
  });
});
