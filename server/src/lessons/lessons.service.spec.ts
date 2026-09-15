import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { Lesson } from '../modules/entities/lesson.entity';
import { Module as ModuleEntity } from '../modules/entities/module.entity';

describe('LessonsService', () => {
  let service: LessonsService;

  const mockLesson: Lesson = {
    id: 'great-pyramid',
    moduleId: 'seven-wonders',
    title: 'The Great Pyramid of Giza',
    description: 'First wonder',
    contents: 'Content here',
    orderIndex: 1,
    module: null as any,
  };

  const mockModule: ModuleEntity = {
    id: 'seven-wonders',
    title: 'Seven Wonders',
    description: 'Module desc',
    period: 'Ancient',
    theme: 'Wonders',
    order: 1,
    lessons: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockLessonsRepository = {
    find: vi.fn().mockResolvedValue([mockLesson]),
  };

  const mockModulesRepository = {
    findOneBy: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonsService,
        {
          provide: getRepositoryToken(Lesson),
          useValue: mockLessonsRepository,
        },
        {
          provide: getRepositoryToken(ModuleEntity),
          useValue: mockModulesRepository,
        },
      ],
    }).compile();

    service = module.get<LessonsService>(LessonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getModuleLessons', () => {
    it('should throw NotFoundException when the module does not exist', async () => {
      mockModulesRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.getModuleLessons('nonexistent-module'),
      ).rejects.toThrow(NotFoundException);

      expect(mockModulesRepository.findOneBy).toHaveBeenCalledWith({
        id: 'nonexistent-module',
      });
      expect(mockLessonsRepository.find).not.toHaveBeenCalled();
    });

    it('should return lessons ordered by orderIndex ASC when the module exists', async () => {
      mockModulesRepository.findOneBy.mockResolvedValue(mockModule);
      mockLessonsRepository.find.mockResolvedValue([mockLesson]);

      const result = await service.getModuleLessons('seven-wonders');

      expect(mockModulesRepository.findOneBy).toHaveBeenCalledWith({
        id: 'seven-wonders',
      });
      expect(mockLessonsRepository.find).toHaveBeenCalledWith({
        where: {
          moduleId: 'seven-wonders',
        },
        order: {
          orderIndex: 'ASC',
        },
      });
      expect(result).toEqual([mockLesson]);
    });
  });
});
