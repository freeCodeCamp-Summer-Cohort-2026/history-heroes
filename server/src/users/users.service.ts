import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  /**
   * Returns mock user data for the current user placeholder.
   */
  getMe() {
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
}
