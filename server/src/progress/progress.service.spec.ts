import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ProgressService } from './progress.service';
import { UserLessonProgress } from './entities/user-lesson-progress.entity';
import { UserLabProgress } from './entities/user-lab-progress.entity';

describe('ProgressService', () => {
  let service: ProgressService;

  const mockLessonProgressRepository = {
    findOne: vi.fn(),
    find: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    remove: vi.fn(),
  };

  const mockLabProgressRepository = {
    findOne: vi.fn(),
    find: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    remove: vi.fn(),
  };

  const mockTransaction = vi.fn();
  const mockEntityManager = {
    getRepository: vi.fn((entity: any) => {
      if (entity === UserLabProgress) {
        return mockLabProgressRepository;
      }
      return mockLessonProgressRepository;
    }),
  };
  const mockDataSource = {
    transaction: mockTransaction,
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    mockTransaction.mockImplementation(async (callback: any) => {
      return await callback(mockEntityManager);
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgressService,
        {
          provide: getRepositoryToken(UserLessonProgress),
          useValue: mockLessonProgressRepository,
        },
        {
          provide: getRepositoryToken(UserLabProgress),
          useValue: mockLabProgressRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
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

    it('should create and return a new progress record for an authenticated user within transaction', async () => {
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
      expect(mockTransaction).toHaveBeenCalled();
      expect(mockLessonProgressRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          lessonId: 'great-pyramid',
          userId: 42,
          sessionId: 'sess-123',
        }),
      );
      expect(mockLessonProgressRepository.save).toHaveBeenCalledWith(
        createdEntity,
      );
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
      mockLessonProgressRepository.save.mockImplementation((item) =>
        Promise.resolve(item),
      );

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

    it('should handle TOCTOU race conditions gracefully if concurrent insert occurs', async () => {
      mockLessonProgressRepository.findOne
        .mockResolvedValueOnce(null) // first check sees nothing
        .mockResolvedValueOnce({
          id: 99,
          lessonId: 'great-pyramid',
          userId: 42,
        }); // concurrent check retrieves record
      mockLessonProgressRepository.create.mockReturnValue({
        lessonId: 'great-pyramid',
        userId: 42,
      });
      mockLessonProgressRepository.save.mockRejectedValueOnce(
        new Error('UNIQUE constraint failed'),
      );

      const result = await service.recordLessonProgress({
        lessonId: 'great-pyramid',
        userId: 42,
      });

      expect(result).toEqual(
        expect.objectContaining({
          id: 99,
          lessonId: 'great-pyramid',
          userId: 42,
        }),
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

    it('should return progress records for an authenticated user and link session records atomically in a transaction', async () => {
      const sessionRecords = [
        { id: 1, lessonId: 'great-pyramid', userId: 42, sessionId: 'sess-1' },
        {
          id: 2,
          lessonId: 'hanging-gardens',
          userId: null,
          sessionId: 'sess-1',
        },
      ];
      mockLessonProgressRepository.find.mockImplementation((query: any) => {
        if (query?.where?.sessionId && !Array.isArray(query.where)) {
          return Promise.resolve(sessionRecords);
        }
        if (query?.where?.userId && !Array.isArray(query.where)) {
          return Promise.resolve([sessionRecords[0]]);
        }
        return Promise.resolve(sessionRecords);
      });
      mockLessonProgressRepository.save.mockImplementation((item) =>
        Promise.resolve(item),
      );

      const result = await service.getProgress({
        userId: 42,
        sessionId: 'sess-1',
      });

      expect(result).toHaveLength(2);
      expect(mockTransaction).toHaveBeenCalled();
      expect(mockLessonProgressRepository.save).toHaveBeenCalledWith([
        sessionRecords[1],
      ]);
      expect(sessionRecords[1].userId).toBe(42);
    });

    it('should prune duplicate session records if user already has completed lesson', async () => {
      const sessionRecords = [
        { id: 1, lessonId: 'great-pyramid', userId: null, sessionId: 'sess-1' },
      ];
      const userRecords = [
        {
          id: 2,
          lessonId: 'great-pyramid',
          userId: 42,
          sessionId: 'other-sess',
        },
      ];
      mockLessonProgressRepository.find.mockImplementation((query: any) => {
        if (query?.where?.sessionId && !Array.isArray(query.where)) {
          return Promise.resolve(sessionRecords);
        }
        if (query?.where?.userId && !Array.isArray(query.where)) {
          return Promise.resolve(userRecords);
        }
        return Promise.resolve(userRecords);
      });

      const result = await service.getProgress({
        userId: 42,
        sessionId: 'sess-1',
      });

      expect(mockLessonProgressRepository.remove).toHaveBeenCalledWith([
        sessionRecords[0],
      ]);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
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

  describe('recordLabProgress', () => {
    it('should throw UnauthorizedException if neither userId nor sessionId is provided', async () => {
      await expect(
        service.recordLabProgress({ labId: 'great-pyramid-lab' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should create and return a new progress record for an authenticated user within transaction', async () => {
      mockLabProgressRepository.findOne.mockResolvedValue(null);
      const createdEntity = {
        id: 1,
        labId: 'any-lab-id',
        userId: 42,
        sessionId: 'sess-123',
        completedAt: new Date(),
      };
      mockLabProgressRepository.create.mockReturnValue(createdEntity);
      mockLabProgressRepository.save.mockResolvedValue(createdEntity);

      const result = await service.recordLabProgress({
        labId: 'any-lab-id',
        userId: 42,
        sessionId: 'sess-123',
      });

      expect(result).toEqual(createdEntity);
      expect(mockTransaction).toHaveBeenCalled();
      expect(mockLabProgressRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          labId: 'any-lab-id',
          userId: 42,
          sessionId: 'sess-123',
        }),
      );
      expect(mockLabProgressRepository.save).toHaveBeenCalledWith(
        createdEntity,
      );
    });

    it('should create and return a new progress record for an anonymous session', async () => {
      mockLabProgressRepository.findOne.mockResolvedValue(null);
      const createdEntity = {
        id: 2,
        labId: 'custom-lab',
        userId: null,
        sessionId: 'sess-anon',
        completedAt: new Date(),
      };
      mockLabProgressRepository.create.mockReturnValue(createdEntity);
      mockLabProgressRepository.save.mockResolvedValue(createdEntity);

      const result = await service.recordLabProgress({
        labId: 'custom-lab',
        sessionId: 'sess-anon',
      });

      expect(result).toEqual(createdEntity);
      expect(mockLabProgressRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          labId: 'custom-lab',
          userId: null,
          sessionId: 'sess-anon',
        }),
      );
    });

    it('should return existing record idempotently without creating a duplicate', async () => {
      const existing = {
        id: 1,
        labId: 'custom-lab',
        userId: 42,
        sessionId: 'sess-123',
        completedAt: new Date(),
      };
      mockLabProgressRepository.findOne.mockResolvedValue(existing);

      const result = await service.recordLabProgress({
        labId: 'custom-lab',
        userId: 42,
      });

      expect(result).toBe(existing);
      expect(mockLabProgressRepository.create).not.toHaveBeenCalled();
    });

    it('should link existing session record to user when user is newly authenticated', async () => {
      const existing = {
        id: 1,
        labId: 'custom-lab',
        userId: null,
        sessionId: 'sess-123',
        completedAt: new Date(),
      };
      mockLabProgressRepository.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(existing);
      mockLabProgressRepository.save.mockImplementation((item: any) =>
        Promise.resolve(item),
      );

      const result = await service.recordLabProgress({
        labId: 'custom-lab',
        userId: 42,
        sessionId: 'sess-123',
      });

      expect(result.userId).toBe(42);
      expect(mockLabProgressRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1, userId: 42 }),
      );
    });

    it('should handle TOCTOU race conditions gracefully if concurrent insert occurs', async () => {
      mockLabProgressRepository.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({
          id: 99,
          labId: 'custom-lab',
          userId: 42,
        });
      mockLabProgressRepository.create.mockReturnValue({
        labId: 'custom-lab',
        userId: 42,
      });
      mockLabProgressRepository.save.mockRejectedValueOnce(
        new Error('UNIQUE constraint failed'),
      );

      const result = await service.recordLabProgress({
        labId: 'custom-lab',
        userId: 42,
      });

      expect(result).toEqual(
        expect.objectContaining({
          id: 99,
          labId: 'custom-lab',
          userId: 42,
        }),
      );
    });
  });

  describe('getLabProgress', () => {
    it('should return null if neither userId nor sessionId is provided', async () => {
      const result = await service.getLabProgress({ labId: 'custom-lab' });
      expect(result).toBeNull();
    });

    it('should return null if no progress is found for a lab', async () => {
      mockLabProgressRepository.findOne.mockResolvedValue(null);

      const result = await service.getLabProgress({
        labId: 'custom-lab',
        userId: 42,
      });

      expect(result).toBeNull();
    });

    it('should return record if found by userId', async () => {
      const record = { id: 1, labId: 'custom-lab', userId: 42 };
      mockLabProgressRepository.findOne.mockResolvedValue(record);

      const result = await service.getLabProgress({
        labId: 'custom-lab',
        userId: 42,
      });

      expect(result).toEqual(record);
    });

    it('should return record if found by sessionId and link to authenticated user', async () => {
      const record = {
        id: 1,
        labId: 'custom-lab',
        userId: null,
        sessionId: 'sess-123',
      };
      mockLabProgressRepository.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(record);
      mockLabProgressRepository.save.mockImplementation((item: any) =>
        Promise.resolve(item),
      );

      const result = await service.getLabProgress({
        labId: 'custom-lab',
        userId: 42,
        sessionId: 'sess-123',
      });

      expect(result?.userId).toBe(42);
      expect(mockLabProgressRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 42 }),
      );
    });
  });
});
