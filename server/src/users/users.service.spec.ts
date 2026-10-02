import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserLessonProgress } from '../progress/entities/user-lesson-progress.entity';
import { UserLabProgress } from '../progress/entities/user-lab-progress.entity';

describe('UsersService', () => {
  let service: UsersService;
  const mockUser: User = {
    id: 1,
    email: 'test@historyheroes.org',
    isContentAuthor: false,
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
    delete: vi.fn(),
  };

  const mockLessonProgressRepo = {
    delete: vi.fn(),
  };

  const mockLabProgressRepo = {
    delete: vi.fn(),
  };

  const mockUserEntityRepo = {
    delete: vi.fn(),
  };

  const mockEntityManager = {
    getRepository: vi.fn((entity: any) => {
      if (entity === UserLessonProgress) return mockLessonProgressRepo;
      if (entity === UserLabProgress) return mockProgressLabRepo;
      return mockUserEntityRepo;
    }),
  };
  const mockProgressLabRepo = mockLabProgressRepo;

  const mockTransaction = vi.fn();
  const mockDataSource = {
    transaction: mockTransaction,
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    mockQueryBuilder.where.mockReturnThis();
    mockQueryBuilder.addSelect.mockReturnThis();
    mockTransaction.mockImplementation(async (callback: any) => {
      return await callback(mockEntityManager);
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
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

  describe('getById', () => {
    it('should return user data when a user with the given id exists', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(mockUser);

      const result = await service.getById(1);

      expect(result).toEqual(mockUser);
      expect(mockUsersRepository.createQueryBuilder).toHaveBeenCalledWith(
        'user',
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('user.id = :id', {
        id: 1,
      });
      expect(mockQueryBuilder.addSelect).not.toHaveBeenCalled();
    });

    it('should include password in query when includePassword setting is true', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(mockUser);

      const result = await service.getById(1, { includePassword: true });

      expect(result).toEqual(mockUser);
      expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith('user.password');
    });

    it('should return null when a user with the given id does not exist', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);

      const result = await service.getById(999);

      expect(result).toBeNull();
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('user.id = :id', {
        id: 999,
      });
    });
  });

  describe('updateContentAuthor', () => {
    it('should update and return the user when user exists', async () => {
      const user = { ...mockUser, isContentAuthor: false };
      mockQueryBuilder.getOne.mockResolvedValue(user);
      mockUsersRepository.save.mockImplementation(async (u) => u);

      const result = await service.updateContentAuthor(1, true);

      expect(result.isContentAuthor).toBe(true);
      expect(mockUsersRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1, isContentAuthor: true }),
      );
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);

      await expect(service.updateContentAuthor(999, true)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('changePassword', () => {
    it('should throw BadRequestException if new password is too short', async () => {
      await expect(
        service.changePassword(1, 'oldPassword123', 'short'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);

      await expect(
        service.changePassword(999, 'oldPassword123', 'newPassword123'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if current password does not match', async () => {
      const hashedPassword = await bcrypt.hash('correctPassword123', 10);
      mockQueryBuilder.getOne.mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      });

      await expect(
        service.changePassword(1, 'wrongPassword', 'newPassword123'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should successfully update password when inputs are valid', async () => {
      const oldHashedPassword = await bcrypt.hash('oldPassword123', 10);
      const userWithPassword = {
        ...mockUser,
        password: oldHashedPassword,
      };
      mockQueryBuilder.getOne.mockResolvedValue(userWithPassword);
      mockUsersRepository.save.mockResolvedValue(userWithPassword);

      await service.changePassword(1, 'oldPassword123', 'brandNewPassword123');

      expect(mockUsersRepository.save).toHaveBeenCalled();
      const savedUser = mockUsersRepository.save.mock.calls[0][0];
      const matches = await bcrypt.compare(
        'brandNewPassword123',
        savedUser.password,
      );
      expect(matches).toBe(true);
    });
  });

  describe('deleteUser', () => {
    it('should throw NotFoundException if user does not exist', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);

      await expect(service.deleteUser(999)).rejects.toThrow(NotFoundException);
    });

    it('should delete progress records and user within transaction', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(mockUser);

      await service.deleteUser(1);

      expect(mockTransaction).toHaveBeenCalled();
      expect(mockLessonProgressRepo.delete).toHaveBeenCalledWith({ userId: 1 });
      expect(mockLabProgressRepo.delete).toHaveBeenCalledWith({ userId: 1 });
      expect(mockUserEntityRepo.delete).toHaveBeenCalledWith(1);
    });

    it('should fall back to usersRepository.delete if dataSource is not provided', async () => {
      const serviceWithoutDataSource = new UsersService(
        mockUsersRepository as any,
      );
      mockQueryBuilder.getOne.mockResolvedValue(mockUser);

      await serviceWithoutDataSource.deleteUser(1);

      expect(mockUsersRepository.delete).toHaveBeenCalledWith(1);
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
    it('should create and save a new user with default isContentAuthor as false', async () => {
      const newUserData = {
        email: 'newuser@historyheroes.org',
        password: 'password123',
      };

      mockUsersRepository.save.mockImplementation(async (entity: User) => ({
        id: 2,
        email: entity.email,
        password: entity.password,
        isContentAuthor: entity.isContentAuthor,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const result = await service.create(newUserData);

      expect(result.id).toBe(2);
      expect(result.email).toBe(newUserData.email);
      expect(result.isContentAuthor).toBe(false);
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
          isContentAuthor: false,
        }),
      );
    });

    it('should create user with isContentAuthor: true when provided', async () => {
      const newUserData = {
        email: 'author@historyheroes.org',
        password: 'password123',
        isContentAuthor: true,
      };

      mockUsersRepository.save.mockImplementation(async (entity: User) => ({
        id: 3,
        email: entity.email,
        password: entity.password,
        isContentAuthor: entity.isContentAuthor,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const result = await service.create(newUserData);

      expect(result.id).toBe(3);
      expect(result.isContentAuthor).toBe(true);
      expect(mockUsersRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: newUserData.email,
          password: expect.any(String),
          isContentAuthor: true,
        }),
      );
    });
  });

  describe('saltRounds configuration', () => {
    it('should throw an error if BCRYPT_SALT_ROUNDS is less than 10', () => {
      const mockConfigService = {
        get: vi.fn().mockReturnValue(5),
      };

      expect(() => {
        new UsersService(mockUsersRepository as any, mockConfigService as any);
      }).toThrow('BCRYPT_SALT_ROUNDS must be at least 10');
    });

    it('should throw an error if BCRYPT_SALT_ROUNDS is non-numeric or NaN', () => {
      const mockConfigService = {
        get: vi.fn().mockReturnValue('invalid'),
      };

      expect(() => {
        new UsersService(mockUsersRepository as any, mockConfigService as any);
      }).toThrow('BCRYPT_SALT_ROUNDS must be at least 10');
    });

    it('should throw an error if BCRYPT_SALT_ROUNDS is a float', () => {
      const mockConfigService = {
        get: vi.fn().mockReturnValue(10.5),
      };

      expect(() => {
        new UsersService(mockUsersRepository as any, mockConfigService as any);
      }).toThrow('BCRYPT_SALT_ROUNDS must be at least 10');
    });

    it('should succeed when BCRYPT_SALT_ROUNDS is 10 or greater', () => {
      const mockConfigService = {
        get: vi.fn().mockReturnValue('12'),
      };

      expect(() => {
        new UsersService(mockUsersRepository as any, mockConfigService as any);
      }).not.toThrow();
    });
  });
});
