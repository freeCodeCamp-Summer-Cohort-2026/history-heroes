import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiResponse } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Password property was intentionally left out for security reasons (should never appear in API docs or responses)
 */

class UserDto{
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * The primary/only "get" route that returns the user data for the current authenticated users. This should be used in conjunction code with the authentication middleware to ensure that the user is authenticated before accessing this route.
   *
   * On the front-end this route should be called on page load to get the user data and store it in the front-end.
   *
   * This can be loaded at: https://localhost:3000/api/v1/users/me
   *
   * TODO: add authentication guards (not middleware in nestjs), see:
   * https://docs.nestjs.com/guards
   */
  @Get('me')
  @ApiResponse({ type: UserDto })
  public getMe() {
    return this.usersService.getMe();
  }

  // **note** other future use-case would be a delete
}
