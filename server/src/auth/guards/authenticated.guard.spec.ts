import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthenticatedGuard } from './authenticated.guard';

describe('AuthenticatedGuard', () => {
  let guard: AuthenticatedGuard;

  beforeEach(() => {
    guard = new AuthenticatedGuard();
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

  it('should allow access when session has userId', () => {
    const context = createMockExecutionContext({ userId: 1 });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw UnauthorizedException when session is missing', () => {
    const context = createMockExecutionContext(undefined);
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when userId is missing', () => {
    const context = createMockExecutionContext({});
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });
});
