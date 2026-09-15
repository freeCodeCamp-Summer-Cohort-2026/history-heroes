import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SessionStoreService } from './session-store.service';
import { SessionEntity } from './entities/session.entity';
import type { SessionData } from 'express-session';

describe('SessionStoreService', () => {
  let service: SessionStoreService;

  const mockSessionRepo = {
    findOneBy: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionStoreService,
        {
          provide: getRepositoryToken(SessionEntity),
          useValue: mockSessionRepo,
        },
      ],
    }).compile();

    service = module.get<SessionStoreService>(SessionStoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('should return session data when active', async () => {
      const mockSessionData: SessionData = {
        cookie: { originalMaxAge: 3600 } as any,
      };

      mockSessionRepo.findOneBy.mockResolvedValue({
        id: 'sess-1',
        data: mockSessionData,
        expiresAt: Date.now() + 10000,
      });

      await new Promise<void>((resolve) => {
        service.get('sess-1', (err, session) => {
          expect(err).toBeNull();
          expect(session).toEqual(mockSessionData);
          resolve();
        });
      });
    });

    it('should return null when session has expired', async () => {
      mockSessionRepo.findOneBy.mockResolvedValue({
        id: 'sess-1',
        data: { cookie: {} },
        expiresAt: Date.now() - 1000,
      });

      await new Promise<void>((resolve) => {
        service.get('sess-1', (err, session) => {
          expect(err).toBeNull();
          expect(session).toBeNull();
          resolve();
        });
      });
    });
  });

  describe('set', () => {
    it('should save session directly as an object', async () => {
      const sessionData: SessionData = {
        cookie: { maxAge: 5000 } as any,
      };

      mockSessionRepo.save.mockResolvedValue({});

      await new Promise<void>((resolve) => {
        service.set('sess-1', sessionData, (err) => {
          expect(err).toBeNull();
          expect(mockSessionRepo.save).toHaveBeenCalledWith(
            expect.objectContaining({
              id: 'sess-1',
              data: sessionData,
            }),
          );
          resolve();
        });
      });
    });
  });

  describe('destroy', () => {
    it('should delete session by id', async () => {
      mockSessionRepo.delete.mockResolvedValue({ affected: 1 });

      await new Promise<void>((resolve) => {
        service.destroy('sess-1', (err) => {
          expect(err).toBeNull();
          expect(mockSessionRepo.delete).toHaveBeenCalledWith({ id: 'sess-1' });
          resolve();
        });
      });
    });
  });
});
