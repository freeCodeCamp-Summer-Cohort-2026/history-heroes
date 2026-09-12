import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { SeedsService } from './seeds.service';
import { User } from '../../../users/entities/user.entity';
import { Module } from '../../../modules/entities/module.entity';
import { UserSeeder } from './seeders/user.seeder.service';
import { ModuleSeeder } from './seeders/module.seeder.service';

describe('SeedsService', () => {
  let service: SeedsService;

  const mockCount = vi.fn();
  const mockTransaction = vi.fn();
  const mockDataSource = {
    getRepository: vi.fn().mockReturnValue({
      count: mockCount,
    }),
    transaction: mockTransaction,
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserSeeder,
        ModuleSeeder,
        SeedsService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<SeedsService>(SeedsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should skip seed if users already exist', async () => {
    mockCount.mockResolvedValue(1);
    await service.runSeeds();
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  it('should run seed transaction for users and modules when database is empty', async () => {
    mockCount.mockResolvedValue(0);

    const mockEntityManager = {
      create: vi.fn((_entity, data) => data),
      save: vi.fn().mockResolvedValue(undefined),
    };

    mockTransaction.mockImplementation(async (callback) => {
      await callback(mockEntityManager);
    });

    await service.runSeeds();

    expect(mockTransaction).toHaveBeenCalled();
    // if create was called at all, could be any times, but should be at least once
    expect(mockEntityManager.create).toHaveBeenCalledWith(
      User,
      expect.anything(),
    );
    expect(mockEntityManager.create).toHaveBeenCalledWith(
      Module,
      expect.anything(),
    );

    // save is always called, and called in this order, will be important
    // later with other seeders are added.
    expect(mockEntityManager.save).toHaveBeenNthCalledWith(
      1,
      User,
      expect.anything(),
    );
    expect(mockEntityManager.save).toHaveBeenNthCalledWith(
      2,
      Module,
      expect.anything(),
    );
  });
});
