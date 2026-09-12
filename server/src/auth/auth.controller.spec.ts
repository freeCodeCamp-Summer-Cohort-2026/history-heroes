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
    create: vi.fn(),
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
        password: 'password123',
      };
      mockUsersService.getByEmail.mockResolvedValue(mockUser);

      const mockReq = {
        session: {} as Record<string, any>,
      } as unknown as Request;

      const result = await controller.login(
        { email: 'test@historyheroes.org', password: 'password123' },
        mockReq,
      );

      expect(result).toEqual({ id: 1, email: 'test@historyheroes.org' });
      expect(mockReq.session.userId).toBe(1);
      expect(mockUsersService.getByEmail).toHaveBeenCalledWith(
        { email: 'test@historyheroes.org', password: 'password123' },
        { includePassword: true },
      );
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      mockUsersService.getByEmail.mockResolvedValue(null);

      const mockReq = { session: {} } as unknown as Request;

      await expect(
        controller.login(
          { email: 'unknown@historyheroes.org', password: 'password123' },
          mockReq,
        ),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const mockUser: Partial<User> = {
        id: 1,
        email: 'test@historyheroes.org',
        password: 'correct-password',
      };
      mockUsersService.getByEmail.mockResolvedValue(mockUser);

      const mockReq = { session: {} } as unknown as Request;

      await expect(
        controller.login(
          { email: 'test@historyheroes.org', password: 'wrong-password' },
          mockReq,
        ),
      ).rejects.toThrow(UnauthorizedException);
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
    it('should create user, set session userId and return created user info', async () => {
      mockUsersService.getByEmail.mockResolvedValue(null);

      const createdUser: Partial<User> = {
        id: 2,
        email: 'newuser@historyheroes.org',
        password: 'password123',
      };
      mockUsersService.create.mockResolvedValue(createdUser);

      const mockReq = {
        session: {} as Record<string, any>,
      } as unknown as Request;

      const result = await controller.register(
        { email: 'newuser@historyheroes.org', password: 'password123' },
        mockReq,
      );

      expect(result).toEqual({ id: 2, email: 'newuser@historyheroes.org' });
      expect(mockReq.session.userId).toBe(2);
      expect(mockUsersService.getByEmail).toHaveBeenCalledWith({
        email: 'newuser@historyheroes.org',
        password: 'password123',
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
          { email: 'existing@historyheroes.org', password: 'password123' },
          mockReq,
        ),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('getSession', () => {
    it('should return session info object', () => {
      const session = { userId: 1, cookie: {} };
      expect(controller.getSession(session)).toEqual({
        session_info: session,
      });
    });
  });
});
