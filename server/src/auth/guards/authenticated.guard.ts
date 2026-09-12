import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

/**
 * Guard that is used to block resources based on if you have a session.
 *
 * This should only be used for protecting APIs related to user specific information, which would only cover a specific group of APIs related to user management, like a hypothetical change password or delete account.
 *
 * Everything should be public by default and linked to the user's session
 */
@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const isAuthenticated = Boolean(request.session && request.session.userId);

    if (!isAuthenticated) {
      throw new UnauthorizedException(
        'You must be logged in to view this resource',
      );
    }

    return true;
  }
}
