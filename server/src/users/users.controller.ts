import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController {
  /**
   * The primary/only "get" route that returns the user data for the current authenticated users. This should be used in conjunction code with the authentication middleware to ensure that the user is authenticated before accessing this route.
   *
   * On the front-end this route should be called on page load to get the user data and store it in the front-end.
   *
   * This can be loaded at: https://localhost:3000/users/me
   *
   * TODO: add authentication guards (not middleware in nestjs), see:
   * https://docs.nestjs.com/guards
   */
  @Get('me')
  public getMe() {
    // TODO: this doesn't check anything, just returns a placeholder.
    // the type isn't defined either!
    return {
      id: 1, // This is the most important thing.
      username: 'test-user',
      // note, email and password are **of course** not returned.
      // emails are not verified, we just use them as a unique identifier.
      //
    };
  }

  // **note** other future use-case would be a delete
}
