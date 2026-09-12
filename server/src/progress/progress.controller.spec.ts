import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import type { Request } from 'express';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { UserLessonProgress } from './entities/user-lesson-progress.entity';

describe('ProgressController', () => {
  let controller: ProgressController;

  const mockProgressService = {
    getProgress: vi.fn(),
    recordLessonProgress: vi.fn(),
    getLessonProgress: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgressController],
      providers: [
        {
          provide: ProgressService,
          useValue: mockProgressService,
        },
      ],
    }).compile();

    controller = module.get<ProgressController>(ProgressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProgress', () => {
    it('should retrieve progress with userId and sessionId from request', async () => {
      const mockResult: UserLessonProgress[] = [
        {
          id: 1,
          lessonId: 'great-pyramid',
          userId: 10,
          sessionId: 'sess-123',
          completedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockProgressService.getProgress.mockResolvedValue(mockResult);

      const mockReq = {
        session: { userId: 10 },
        sessionID: 'sess-123',
      } as unknown as Request;

      const result = await controller.getProgress(mockReq);

      expect(result).toEqual(mockResult);
      expect(mockProgressService.getProgress).toHaveBeenCalledWith({
        userId: 10,
        sessionId: 'sess-123',
      });
    });
  });

  describe('recordLessonProgress', () => {
    it('should record lesson progress via POST', async () => {
      const mockResult = {
        id: 1,
        lessonId: 'great-pyramid',
        userId: 10,
        sessionId: 'sess-123',
        completedAt: new Date(),
      };
      mockProgressService.recordLessonProgress.mockResolvedValue(mockResult);

      const mockReq = {
        session: { userId: 10 },
        sessionID: 'sess-123',
      } as unknown as Request;

      const result = await controller.recordLessonProgress('great-pyramid', mockReq);

      expect(result).toEqual(mockResult);
      expect(mockProgressService.recordLessonProgress).toHaveBeenCalledWith({
        lessonId: 'great-pyramid',
        userId: 10,
        sessionId: 'sess-123',
      });
    });

    it('should record lesson progress via PUT idempotently', async () => {
      const mockResult = {
        id: 1,
        lessonId: 'great-pyramid',
        userId: 10,
        sessionId: 'sess-123',
        completedAt: new Date(),
      };
      mockProgressService.recordLessonProgress.mockResolvedValue(mockResult);

      const mockReq = {
        session: { userId: 10 },
        sessionID: 'sess-123',
      } as unknown as Request;

      const result = await controller.recordLessonProgressPut('great-pyramid', mockReq);

      expect(result).toEqual(mockResult);
      expect(mockProgressService.recordLessonProgress).toHaveBeenCalledWith({
        lessonId: 'great-pyramid',
        userId: 10,
        sessionId: 'sess-123',
      });
    });
  });

  describe('getLessonProgress', () => {
    it('should return lesson progress if found', async () => {
      const mockResult = {
        id: 1,
        lessonId: 'great-pyramid',
        userId: 10,
        sessionId: 'sess-123',
        completedAt: new Date(),
      };
      mockProgressService.getLessonProgress.mockResolvedValue(mockResult);

      const mockReq = {
        session: { userId: 10 },
        sessionID: 'sess-123',
      } as unknown as Request;

      const result = await controller.getLessonProgress('great-pyramid', mockReq);

      expect(result).toEqual(mockResult);
    });

    it('should throw NotFoundException if progress not found', async () => {
      mockProgressService.getLessonProgress.mockResolvedValue(null);

      const mockReq = {
        session: { userId: 10 },
        sessionID: 'sess-123',
      } as unknown as Request;

      await expect(
        controller.getLessonProgress('unknown-lesson', mockReq),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
