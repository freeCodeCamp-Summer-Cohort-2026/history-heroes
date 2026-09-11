import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  const mockUser: User = {
    id: 1,
    email: 'test@historyheroes.org',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockQueryBuilder = {
    where: vi.fn().mockReturnThis(),
    addSelect: vi.fn().mockReturnThis(),
    getOne: vi.fn(),
  };

  const mockUsersRepository = {
    createQueryBuilder: vi.fn().mockReturnValue(mockQueryBuilder),
    save: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    mockQueryBuilder.where.mockReturnThis();
    mockQueryBuilder.addSelect.mockReturnThis();

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

  describe('getByEmail', () => {
    it('should return user data when a user with the given email exists', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(mockUser);

      const result = await service.getByEmail({
        email: 'test@historyheroes.org',
      });

      expect(result).toEqual(mockUser);
      expect(mockUsersRepository.createQueryBuilder).toHaveBeenCalledWith(
        'user',
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'user.email = :email',
        {
          email: 'test@historyheroes.org',
        },
      );
      expect(mockQueryBuilder.addSelect).not.toHaveBeenCalled();
    });

    it('should include password in query when includePassword setting is true', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(mockUser);

      const result = await service.getByEmail(
        { email: 'test@historyheroes.org' },
        { includePassword: true },
      );

      expect(result).toEqual(mockUser);
      expect(mockUsersRepository.createQueryBuilder).toHaveBeenCalledWith(
        'user',
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'user.email = :email',
        {
          email: 'test@historyheroes.org',
        },
      );
      expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith('user.password');
    });

    it('should return null when a user with the given email does not exist', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);

      const result = await service.getByEmail({
        email: 'nonexistent@historyheroes.org',
      });

      expect(result).toBeNull();
      expect(mockUsersRepository.createQueryBuilder).toHaveBeenCalledWith(
        'user',
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'user.email = :email',
        {
          email: 'nonexistent@historyheroes.org',
        },
      );
    });
  });

  describe('create', () => {
    it('should create and save a new user', async () => {
      const newUserData = {
        email: 'newuser@historyheroes.org',
        password: 'password123',
      };

      const savedUser: User = {
        id: 2,
        email: newUserData.email,
        password: newUserData.password,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersRepository.save.mockResolvedValue(savedUser);

      const result = await service.create(newUserData);

      expect(result).toEqual(savedUser);
      const expectedUser = new User();
      expectedUser.email = newUserData.email;
      expectedUser.password = newUserData.password;
      expect(mockUsersRepository.save).toHaveBeenCalledWith(expectedUser);
    });
  });
});
