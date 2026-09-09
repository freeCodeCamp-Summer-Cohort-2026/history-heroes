import { Test, TestingModule } from '@nestjs/testing';
import { ModulesController } from './modules.controller';
import { ModulesService } from './modules.service';
import { Module } from './entities/module.entity';

describe('ModulesController', () => {
  let controller: ModulesController;
  const mockModules: Module[] = [
    {
      id: 'seven-wonders',
      title: 'Seven Wonders',
      description: 'Learn and explore the 7 ancient wonders of the world.',
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockModulesService = {
    findAll: vi.fn().mockResolvedValue(mockModules),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModulesController],
      providers: [
        {
          provide: ModulesService,
          useValue: mockModulesService,
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
});
