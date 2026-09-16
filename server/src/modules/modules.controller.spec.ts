import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ModulesController } from './modules.controller';
import { ModulesService } from './modules.service';
import { Module } from './entities/module.entity';
import { LessonsService } from '../lessons/lessons.service';
import { Lesson } from '../lessons/entities/lesson.entity';

// TODO: this test can possibly be removed, focus on e2e tests.
describe('ModulesController', () => {
  let controller: ModulesController;
  const mockModules: Module[] = [
    {
      id: 'seven-wonders',
      title: 'Seven Wonders',
      description: 'Learn and explore the 7 ancient wonders of the world.',
      period: null,
      theme: null,
      order: 1,
      lessons: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const orderedLessons: Lesson[] = [
    {
      id: 'great-pyramid',
      moduleId: 'seven-wonders',
      title: 'The Great Pyramid of Giza',
      description: 'First wonder lesson',
      contents: 'Content for Great Pyramid',
      orderIndex: 1,
      module: null as any,
    },
    {
      id: 'hanging-gardens',
      moduleId: 'seven-wonders',
      title: 'The Hanging Gardens of Babylon',
      description: 'Second wonder lesson',
      contents: 'Content for Hanging Gardens',
      orderIndex: 2,
      module: null as any,
    },
  ];

  const mockModulesService = {
    findAll: vi.fn().mockResolvedValue(mockModules),
    findById: vi.fn().mockResolvedValue(mockModules[0]),
  };

  const mockLessonService = {
    getModuleLessons: vi.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModulesController],
      providers: [
        {
          provide: ModulesService,
          useValue: mockModulesService,
        },
        {
          provide: LessonsService,
          useValue: mockLessonService,
        },
      ],
    }).compile();

    controller = module.get<ModulesController>(ModulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of modules', async () => {
      expect(await controller.findAll()).toEqual(mockModules);
      expect(mockModulesService.findAll).toHaveBeenCalled();
    });
  });

  describe('getModuleLessons', () => {
    it('should return an empty lesson collection when module exists with no lessons', async () => {
      mockLessonService.getModuleLessons.mockResolvedValue([]);

      const result = await controller.getModuleLessons('seven-wonders');
      expect(result).toEqual([]);
      expect(mockLessonService.getModuleLessons).toHaveBeenCalledWith(
        'seven-wonders',
      );
    });

    it('should return ordered lessons when module exists', async () => {
      mockLessonService.getModuleLessons.mockResolvedValue(orderedLessons);

      const result = await controller.getModuleLessons('seven-wonders');

      expect(result).toEqual(orderedLessons);
      expect(result.map((lesson) => lesson.orderIndex)).toEqual([1, 2]);
      expect(mockLessonService.getModuleLessons).toHaveBeenCalledWith(
        'seven-wonders',
      );
    });

    it('should throw NotFoundException when module does not exist', async () => {
      mockLessonService.getModuleLessons.mockRejectedValue(
        new NotFoundException('Module with id "nonexistent-module" not found'),
      );

      await expect(
        controller.getModuleLessons('nonexistent-module'),
      ).rejects.toThrow(NotFoundException);
      expect(mockLessonService.getModuleLessons).toHaveBeenCalledWith(
        'nonexistent-module',
      );
    });
  });
});
