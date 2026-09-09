import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  const mockUser: User = {
    id: 1,
    username: 'test-user',
    email: 'test@historyheroes.org',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUsersRepository = {
    findOne: vi.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMe', () => {
    it('should return user data', async () => {
      const result = await service.getMe();
      expect(result).toEqual(mockUser);
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'test-user' },
      });
    });
  });
});
