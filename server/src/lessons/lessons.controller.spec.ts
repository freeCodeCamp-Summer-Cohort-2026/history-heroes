import { Test, TestingModule } from '@nestjs/testing';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';

describe('LessonsController', () => {
  let controller: LessonsController;

  const mockLessonsService = {
    findById: vi.fn(),
    update: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonsController],
      providers: [
        {
          provide: LessonsService,
          useValue: mockLessonsService,
        },
      ],
    }).compile();

    controller = module.get<LessonsController>(LessonsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('update', () => {
    it('should update a lesson', async () => {
      const updates = {
        title: 'Updated Great Pyramid',
        description: 'Updated description',
        contents: 'Updated lesson contents',
      };

      const updatedLesson = {
        id: 'great-pyramid',
        moduleId: 'seven-wonders',
        orderIndex: 1,
        module: null,
        ...updates,
      };

      mockLessonsService.update.mockResolvedValue(updatedLesson);

      const result = await controller.update('great-pyramid', updates);

      expect(result).toEqual(updatedLesson);
      expect(mockLessonsService.update).toHaveBeenCalledWith(
        'great-pyramid',
        updates,
      );
    });
  });
});
