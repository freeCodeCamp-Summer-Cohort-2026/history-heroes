import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    updateContentAuthor: vi.fn(),
    changePassword: vi.fn(),
    deleteUser: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updateMe', () => {
    it('should update isContentAuthor and return user info on PATCH', async () => {
      mockUsersService.updateContentAuthor.mockResolvedValue({
        id: 1,
        email: 'test@historyheroes.org',
        isContentAuthor: true,
      });

      const mockReq = {
        session: { userId: 1 },
      } as unknown as Request;

      const result = await controller.updateMe(
        { isContentAuthor: true },
        mockReq,
      );

      expect(mockUsersService.updateContentAuthor).toHaveBeenCalledWith(
        1,
        true,
      );
      expect(result).toEqual({
        id: 1,
        email: 'test@historyheroes.org',
        isContentAuthor: true,
      });
    });

    it('should update isContentAuthor and return user info on PUT', async () => {
      mockUsersService.updateContentAuthor.mockResolvedValue({
        id: 1,
        email: 'test@historyheroes.org',
        isContentAuthor: false,
      });

      const mockReq = {
        session: { userId: 1 },
      } as unknown as Request;

      const result = await controller.updateMePut(
        { isContentAuthor: false },
        mockReq,
      );

      expect(mockUsersService.updateContentAuthor).toHaveBeenCalledWith(
        1,
        false,
      );
      expect(result).toEqual({
        id: 1,
        email: 'test@historyheroes.org',
        isContentAuthor: false,
      });
    });
  });

  describe('changePassword', () => {
    it('should call changePassword on service and return success message', async () => {
      mockUsersService.changePassword.mockResolvedValue(undefined);

      const mockReq = {
        session: { userId: 1 },
      } as unknown as Request;

      const result = await controller.changePassword(
        {
          currentPassword: 'oldPassword123',
          newPassword: 'newPassword123',
        },
        mockReq,
      );

      expect(mockUsersService.changePassword).toHaveBeenCalledWith(
        1,
        'oldPassword123',
        'newPassword123',
      );
      expect(result).toEqual({ message: 'Password updated successfully' });
    });
  });

  describe('deleteMe', () => {
    it('should delete user, destroy session, clear cookie and return success message', async () => {
      mockUsersService.deleteUser.mockResolvedValue(undefined);

      const mockSession = {
        destroy: vi.fn((cb: (err?: any) => void) => cb()),
      };
      const mockReq = {
        session: { ...mockSession, userId: 1 },
      } as unknown as Request;
      const mockRes = {
        clearCookie: vi.fn(),
      } as unknown as Response;

      const result = await controller.deleteMe(mockReq, mockRes);

      expect(mockUsersService.deleteUser).toHaveBeenCalledWith(1);
      expect(mockSession.destroy).toHaveBeenCalled();
      expect(mockRes.clearCookie).toHaveBeenCalledWith('connect.sid', {
        path: '/',
      });
      expect(result).toEqual({ message: 'Account deleted successfully' });
    });

    it('should throw InternalServerErrorException if session destroy fails', async () => {
      mockUsersService.deleteUser.mockResolvedValue(undefined);

      const mockSession = {
        destroy: vi.fn((cb: (err?: any) => void) => cb(new Error('fail'))),
      };
      const mockReq = {
        session: { ...mockSession, userId: 1 },
      } as unknown as Request;
      const mockRes = {
        clearCookie: vi.fn(),
      } as unknown as Response;

      await expect(controller.deleteMe(mockReq, mockRes)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should handle deleteMe when req.session is undefined', async () => {
      mockUsersService.deleteUser.mockResolvedValue(undefined);

      const mockReq = {
        session: undefined,
      } as unknown as Request;
      const mockRes = {
        clearCookie: vi.fn(),
      } as unknown as Response;

      const result = await controller.deleteMe(mockReq, mockRes);

      expect(mockRes.clearCookie).toHaveBeenCalledWith('connect.sid', {
        path: '/',
      });
      expect(result).toEqual({ message: 'Account deleted successfully' });
    });
  });
});
