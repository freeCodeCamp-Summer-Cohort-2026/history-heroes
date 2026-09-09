import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ModulesService } from './modules.service';
import { Module } from './entities/module.entity';

describe('ModulesService', () => {
  let service: ModulesService;
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

  const mockModulesRepository = {
    find: vi.fn().mockResolvedValue(mockModules),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModulesService,
        {
          provide: getRepositoryToken(Module),
          useValue: mockModulesRepository,
        },
      ],
    }).compile();

    service = module.get<ModulesService>(ModulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of modules ordered by order', async () => {
      const result = await service.findAll();
      expect(result).toEqual(mockModules);
      expect(mockModulesRepository.find).toHaveBeenCalledWith({
        order: {
          order: 'ASC',
        },
      });
    });
  });
});
