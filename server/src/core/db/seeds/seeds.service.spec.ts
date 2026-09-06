import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { SeedsService } from './seeds.service';

describe('SeedsService', () => {
  let service: SeedsService;

  const mockDataSource = {
    getRepository: vi.fn().mockReturnValue({
      count: vi.fn().mockResolvedValue(1),
    }),
    transaction: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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
    await service.runSeeds();
    expect(mockDataSource.transaction).not.toHaveBeenCalled();
  });
});
