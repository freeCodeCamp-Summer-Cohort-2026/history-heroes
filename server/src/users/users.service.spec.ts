import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
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

  describe('comparePassword', () => {
    it('should return true when plaintext password matches hash', async () => {
      const hash = await bcrypt.hash('secret123', 10);
      const isMatch = await service.comparePassword('secret123', hash);
      expect(isMatch).toBe(true);
    });

    it('should return false when plaintext password does not match hash', async () => {
      const hash = await bcrypt.hash('secret123', 10);
      const isMatch = await service.comparePassword('wrongpassword', hash);
      expect(isMatch).toBe(false);
    });
  });

  describe('create', () => {
    it('should create and save a new user with a hashed password', async () => {
      const newUserData = {
        email: 'newuser@historyheroes.org',
        password: 'password123',
      };

      mockUsersRepository.save.mockImplementation(async (entity: User) => ({
        id: 2,
        email: entity.email,
        password: entity.password,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const result = await service.create(newUserData);

      expect(result.id).toBe(2);
      expect(result.email).toBe(newUserData.email);
      expect(result.password).not.toBe(newUserData.password);

      const isMatch = await bcrypt.compare(
        newUserData.password,
        result.password!,
      );
      expect(isMatch).toBe(true);

      expect(mockUsersRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: newUserData.email,
          password: expect.any(String),
        }),
      );
    });
  });
});
