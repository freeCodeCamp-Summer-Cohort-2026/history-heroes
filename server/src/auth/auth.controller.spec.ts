import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;

  const mockUsersService = {
    getByEmail: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    comparePassword: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should set session userId and return user on valid credentials', async () => {
      const mockUser: Partial<User> = {
        id: 1,
        email: 'test@historyheroes.org',
        password: 'hashed-password',
        isContentAuthor: true,
      };
      mockUsersService.getByEmail.mockResolvedValue(mockUser);
      mockUsersService.comparePassword.mockResolvedValue(true);

      const mockReq = {
        session: {} as Record<string, any>,
      } as unknown as Request;

      const result = await controller.login(
        { email: 'test@historyheroes.org', password: 'password123' },
        mockReq,
      );

      expect(result).toEqual({
        id: 1,
        email: 'test@historyheroes.org',
        isContentAuthor: true,
      });
      expect(mockReq.session.userId).toBe(1);
      expect(mockUsersService.getByEmail).toHaveBeenCalledWith(
        { email: 'test@historyheroes.org', password: 'password123' },
        { includePassword: true },
      );
      expect(mockUsersService.comparePassword).toHaveBeenCalledWith(
        'password123',
        'hashed-password',
      );
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      mockUsersService.getByEmail.mockResolvedValue(null);
      mockUsersService.comparePassword.mockResolvedValue(false);

      const mockReq = { session: {} } as unknown as Request;

      await expect(
        controller.login(
          { email: 'unknown@historyheroes.org', password: 'password123' },
          mockReq,
        ),
      ).rejects.toThrow(UnauthorizedException);
      expect(mockUsersService.comparePassword).toHaveBeenCalledWith(
        'password123',
        expect.stringMatching(/^\$2[aby]\$10\$/),
      );
    });

    it('should throw UnauthorizedException if user has falsy password', async () => {
      const mockUser: Partial<User> = {
        id: 1,
        email: 'test@historyheroes.org',
        password: '',
      };
      mockUsersService.getByEmail.mockResolvedValue(mockUser);
      mockUsersService.comparePassword.mockResolvedValue(false);

      const mockReq = { session: {} } as unknown as Request;

      await expect(
        controller.login(
          { email: 'test@historyheroes.org', password: 'password123' },
          mockReq,
        ),
      ).rejects.toThrow(UnauthorizedException);
      expect(mockUsersService.comparePassword).toHaveBeenCalledWith(
        'password123',
        expect.stringMatching(/^\$2[aby]\$10\$/),
      );
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const mockUser: Partial<User> = {
        id: 1,
        email: 'test@historyheroes.org',
        password: 'hashed-password',
      };
      mockUsersService.getByEmail.mockResolvedValue(mockUser);
      mockUsersService.comparePassword.mockResolvedValue(false);

      const mockReq = { session: {} } as unknown as Request;

      await expect(
        controller.login(
          { email: 'test@historyheroes.org', password: 'wrong-password' },
          mockReq,
        ),
      ).rejects.toThrow(UnauthorizedException);
      expect(mockUsersService.comparePassword).toHaveBeenCalledWith(
        'wrong-password',
        'hashed-password',
      );
    });
  });

  describe('logout', () => {
    it('should destroy session, clear cookie and return success message', async () => {
      const mockSession = {
        destroy: vi.fn((cb: (err?: any) => void) => cb()),
      };
      const mockReq = { session: mockSession } as unknown as Request;
      const mockRes = {
        clearCookie: vi.fn(),
      } as unknown as Response;

      const result = await controller.logout(mockReq, mockRes);

      expect(mockSession.destroy).toHaveBeenCalled();
      expect(mockRes.clearCookie).toHaveBeenCalledWith('connect.sid', {
        path: '/',
      });
      expect(result).toEqual({ message: 'Logged out successfully' });
    });

    it('should throw InternalServerErrorException if session destroy errors', async () => {
      const mockSession = {
        destroy: vi.fn((cb: (err?: any) => void) => cb(new Error('fail'))),
      };
      const mockReq = { session: mockSession } as unknown as Request;
      const mockRes = {
        clearCookie: vi.fn(),
      } as unknown as Response;

      await expect(controller.logout(mockReq, mockRes)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should handle logout when req.session is undefined', async () => {
      const mockReq = { session: undefined } as unknown as Request;
      const mockRes = {
        clearCookie: vi.fn(),
      } as unknown as Response;

      const result = await controller.logout(mockReq, mockRes);

      expect(mockRes.clearCookie).toHaveBeenCalledWith('connect.sid', {
        path: '/',
      });
      expect(result).toEqual({ message: 'Logged out successfully' });
    });
  });

  describe('register', () => {
    it('should create user with default isContentAuthor, set session userId and return created user info', async () => {
      mockUsersService.getByEmail.mockResolvedValue(null);

      const createdUser: Partial<User> = {
        id: 2,
        email: 'newuser@historyheroes.org',
        password: 'hashed-password',
        isContentAuthor: false,
      };
      mockUsersService.create.mockResolvedValue(createdUser);

      const mockReq = {
        session: {} as Record<string, any>,
      } as unknown as Request;

      const result = await controller.register(
        {
          email: 'newuser@historyheroes.org',
          password: 'password123',
          isContentAuthor: false,
        },
        mockReq,
      );

      expect(result).toEqual({
        id: 2,
        email: 'newuser@historyheroes.org',
        isContentAuthor: false,
      });
      expect(mockReq.session.userId).toBe(2);
      expect(mockUsersService.getByEmail).toHaveBeenCalledWith({
        email: 'newuser@historyheroes.org',
        password: 'password123',
        isContentAuthor: false,
      });
      expect(mockUsersService.create).toHaveBeenCalledWith({
        email: 'newuser@historyheroes.org',
        password: 'password123',
        isContentAuthor: false,
      });
    });

    it('should create user with isContentAuthor: true when provided', async () => {
      mockUsersService.getByEmail.mockResolvedValue(null);

      const createdUser: Partial<User> = {
        id: 3,
        email: 'author@historyheroes.org',
        password: 'hashed-password',
        isContentAuthor: true,
      };
      mockUsersService.create.mockResolvedValue(createdUser);

      const mockReq = {
        session: {} as Record<string, any>,
      } as unknown as Request;

      const result = await controller.register(
        {
          email: 'author@historyheroes.org',
          password: 'password123',
          isContentAuthor: true,
        },
        mockReq,
      );

      expect(result).toEqual({
        id: 3,
        email: 'author@historyheroes.org',
        isContentAuthor: true,
      });
      expect(mockUsersService.create).toHaveBeenCalledWith({
        email: 'author@historyheroes.org',
        password: 'password123',
        isContentAuthor: true,
      });
    });

    it('should throw ConflictException if email is already registered', async () => {
      mockUsersService.getByEmail.mockResolvedValue({
        id: 1,
        email: 'existing@historyheroes.org',
      });

      const mockReq = { session: {} } as unknown as Request;

      await expect(
        controller.register(
          {
            email: 'existing@historyheroes.org',
            password: 'password123',
            isContentAuthor: false,
          },
          mockReq,
        ),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('getSession', () => {
    it('should return session info object with user details including isContentAuthor when user exists', async () => {
      const session = { userId: 1, cookie: {} };
      mockUsersService.getById.mockResolvedValue({
        id: 1,
        email: 'test@historyheroes.org',
        isContentAuthor: true,
      });

      const result = await controller.getSession(session);

      expect(mockUsersService.getById).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        session_info: {
          ...session,
          userId: 1,
          email: 'test@historyheroes.org',
          isContentAuthor: true,
          user: {
            id: 1,
            email: 'test@historyheroes.org',
            isContentAuthor: true,
          },
        },
      });
    });

    it('should return raw session info when user is not found in database', async () => {
      const session = { userId: 999, cookie: {} };
      mockUsersService.getById.mockResolvedValue(null);

      const result = await controller.getSession(session);

      expect(mockUsersService.getById).toHaveBeenCalledWith(999);
      expect(result).toEqual({
        session_info: session,
      });
    });

    it('should return raw session info when session has no userId', async () => {
      const session = { cookie: {} };

      const result = await controller.getSession(session);

      expect(mockUsersService.getById).not.toHaveBeenCalled();
      expect(result).toEqual({
        session_info: session,
      });
    });
  });

  describe('dummyPasswordHash configuration & lifecycle', () => {
    it('should use configured BCRYPT_SALT_ROUNDS in timing-safe dummy hash', async () => {
      const mockConfigService = {
        get: vi.fn().mockReturnValue(11),
      };
      const customController = new AuthController(
        mockUsersService as any,
        mockConfigService as any,
      );

      mockUsersService.getByEmail.mockResolvedValue(null);
      mockUsersService.comparePassword.mockResolvedValue(false);

      const mockReq = { session: {} } as unknown as Request;

      await expect(
        customController.login(
          { email: 'unknown@historyheroes.org', password: 'password123' },
          mockReq,
        ),
      ).rejects.toThrow(UnauthorizedException);

      expect(mockUsersService.comparePassword).toHaveBeenCalledWith(
        'password123',
        expect.stringMatching(/^\$2[aby]\$11\$/),
      );
    });

    it('should generate dummy hash asynchronously onModuleInit', async () => {
      const mockConfigService = {
        get: vi.fn().mockReturnValue(10),
      };
      const customController = new AuthController(
        mockUsersService as any,
        mockConfigService as any,
      );

      await customController.onModuleInit();

      mockUsersService.getByEmail.mockResolvedValue(null);
      mockUsersService.comparePassword.mockResolvedValue(false);

      const mockReq = { session: {} } as unknown as Request;

      await expect(
        customController.login(
          { email: 'unknown@historyheroes.org', password: 'password123' },
          mockReq,
        ),
      ).rejects.toThrow(UnauthorizedException);

      expect(mockUsersService.comparePassword).toHaveBeenCalledWith(
        'password123',
        expect.stringMatching(/^\$2[aby]\$10\$/),
      );
    });

    it('should throw an error if BCRYPT_SALT_ROUNDS is less than 10', () => {
      const mockConfigService = {
        get: vi.fn().mockReturnValue(8),
      };

      expect(() => {
        new AuthController(mockUsersService as any, mockConfigService as any);
      }).toThrow('BCRYPT_SALT_ROUNDS must be at least 10');
    });

    it('should throw an error if BCRYPT_SALT_ROUNDS is non-numeric', () => {
      const mockConfigService = {
        get: vi.fn().mockReturnValue('invalid'),
      };

      expect(() => {
        new AuthController(mockUsersService as any, mockConfigService as any);
      }).toThrow('BCRYPT_SALT_ROUNDS must be at least 10');
    });
  });
});
