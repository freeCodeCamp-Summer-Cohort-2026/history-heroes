import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ModulesController } from './modules.controller';
import { ModulesService } from './modules.service';
import { Module } from './entities/module.entity';
import { LessonsService } from '../lessons/lessons.service';

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

  const mockModulesService = {
    findAll: vi.fn().mockResolvedValue(mockModules),
    findById: vi.fn().mockResolvedValue(mockModules[0]),
  };

  const mockLessonService = {
    getModuleLessons: vi.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
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
    it('should return lessons when module exists', async () => {
      mockModulesService.findById.mockResolvedValue(mockModules[0]);
      mockLessonService.getModuleLessons.mockResolvedValue([]);

      const result = await controller.getModuleLessons('seven-wonders');
      expect(result).toEqual({ lessons: [] });
      expect(mockModulesService.findById).toHaveBeenCalledWith('seven-wonders');
      expect(mockLessonService.getModuleLessons).toHaveBeenCalledWith(
        'seven-wonders',
      );
    });

    it('should throw NotFoundException when module does not exist', async () => {
      mockModulesService.findById.mockResolvedValue(null);
      mockLessonService.getModuleLessons.mockResolvedValue([]);

      await expect(
        controller.getModuleLessons('nonexistent-module'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
