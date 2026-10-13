import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { Module } from './entities/module.entity';

describe('ModulesService', () => {
  let service: ModulesService;
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

  const mockModulesRepository = {
    find: vi.fn().mockResolvedValue(mockModules),
    findOne: vi.fn(),
    save: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

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
  describe('update', () => {
    it('should update an existing module', async () => {
      const existingModule = { ...mockModules[0] };

      const updates = {
        title: 'Updated Seven Wonders',
        description: 'Updated description',
        period: 'Ancient',
        theme: 'Architecture',
      };

      mockModulesRepository.findOne.mockResolvedValue(existingModule);
      mockModulesRepository.save.mockImplementation((module) =>
        Promise.resolve(module),
      );

      const result = await service.update('seven-wonders', updates);

      expect(mockModulesRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'seven-wonders' },
      });

      expect(mockModulesRepository.save).toHaveBeenCalledWith({
        ...existingModule,
        ...updates,
      });

      expect(result).toMatchObject(updates);
    });

    it('should throw NotFoundException when module does not exist', async () => {
      mockModulesRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('missing-module', {
          title: 'Updated title',
        }),
      ).rejects.toThrow(NotFoundException);

      expect(mockModulesRepository.save).not.toHaveBeenCalled();
    });
  });
});
