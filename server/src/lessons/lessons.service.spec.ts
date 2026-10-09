import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LessonsService } from './lessons.service';
import { Lesson } from './entities/lesson.entity';
import { LessonActivityAssignment } from '../activities/entities/lesson-activity-assignment.entity';
import { Module as ModuleEntity } from '../modules/entities/module.entity';
import { NotFoundException } from '@nestjs/common';

describe('LessonsService', () => {
  let service: LessonsService;

  const mockLessonsRepository = {
    findOneBy: vi.fn(),
    save: vi.fn(),
  };

  const mockAssignmentsRepository = {
    find: vi.fn(),
  };

  const mockModulesRepository = {
    findOneBy: vi.fn(),
    find: vi.fn(),
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
          provide: getRepositoryToken(LessonActivityAssignment),
          useValue: mockAssignmentsRepository,
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

  describe('update', () => {
    it('should update an existing lesson', async () => {
      const existingLesson = {
        id: 'great-pyramid',
        moduleId: 'seven-wonders',
        title: 'The Great Pyramid of Giza',
        description: 'First wonder lesson',
        contents: 'Original lesson contents',
        orderIndex: 1,
        module: null as any,
      };

      const updates = {
        title: 'Updated Great Pyramid',
        description: 'Updated description',
        contents: 'Updated lesson contents',
      };

      mockLessonsRepository.findOneBy.mockResolvedValue(existingLesson);

      mockLessonsRepository.save.mockImplementation((lesson) =>
        Promise.resolve(lesson),
      );

      const result = await service.update('great-pyramid', updates);

      expect(mockLessonsRepository.findOneBy).toHaveBeenCalledWith({
        id: 'great-pyramid',
      });

      expect(mockLessonsRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(updates),
      );
      expect(result).toMatchObject(updates);
    });

    it('should throw NotFoundException when lesson does not exist', async () => {
      mockLessonsRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.update('missing-lesson', {
          title: 'Updated title',
        }),
      ).rejects.toThrow(NotFoundException);

      expect(mockLessonsRepository.save).not.toHaveBeenCalled();
    });
  });
});
