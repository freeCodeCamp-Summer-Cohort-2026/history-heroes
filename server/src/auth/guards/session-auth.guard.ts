import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

/**
 * Guard that is used to block resources based on if you have a session.
 */
@Injectable()
export class SessionAuthGuard implements CanActivate {
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
