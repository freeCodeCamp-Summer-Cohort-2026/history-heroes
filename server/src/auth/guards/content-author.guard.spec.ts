import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { ContentAuthorGuard } from './content-author.guard';

describe('ContentAuthorGuard', () => {
  let guard: ContentAuthorGuard;
  let mockUsersService: { getById: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockUsersService = {
      getById: vi.fn(),
    };
    guard = new ContentAuthorGuard(mockUsersService as unknown as UsersService);
  });

  function createMockExecutionContext(
    session?: Record<string, any>,
  ): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ session }),
      }),
    } as unknown as ExecutionContext;
  }

  it('should allow access when user is a content author', async () => {
    mockUsersService.getById.mockResolvedValue({
      id: 1,
      email: 'author@historyheroes.org',
      isContentAuthor: true,
    });

    const context = createMockExecutionContext({ userId: 1 });
    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(mockUsersService.getById).toHaveBeenCalledWith(1);
  });

  it('should throw UnauthorizedException when session is missing', async () => {
    const context = createMockExecutionContext(undefined);
    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException when userId is missing', async () => {
    const context = createMockExecutionContext({});
    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw ForbiddenException when user is not found in database', async () => {
    mockUsersService.getById.mockResolvedValue(null);

    const context = createMockExecutionContext({ userId: 999 });
    await expect(guard.canActivate(context)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('should throw ForbiddenException when user is not a content author', async () => {
    mockUsersService.getById.mockResolvedValue({
      id: 2,
      email: 'learner@historyheroes.org',
      isContentAuthor: false,
    });

    const context = createMockExecutionContext({ userId: 2 });
    await expect(guard.canActivate(context)).rejects.toThrow(
      ForbiddenException,
    );
  });
});
