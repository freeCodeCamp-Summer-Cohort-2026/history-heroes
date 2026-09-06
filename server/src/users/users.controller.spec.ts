import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  const mockUser: User = {
    id: 1,
    username: 'test-user',
    email: 'test@historyheroes.org',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUsersService = {
    getMe: vi.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
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

  describe('getMe', () => {
    it('should return user data', async () => {
      expect(await controller.getMe()).toEqual(mockUser);
    });
  });
});
