import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from '../../users/users.service';

/**
 * Guard that verifies the user is authenticated and is a content author.
 */
@Injectable()
export class ContentAuthorGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const userId = request.session?.userId;
    if (!userId) {
      throw new UnauthorizedException(
        'You must be logged in to view this resource',
      );
    }

    const user = await this.usersService.getById(userId);
    if (!user || !user.isContentAuthor) {
      throw new ForbiddenException(
        'You must be a content author to perform this action',
      );
    }

    return true;
  }
}
