import { Injectable } from '@nestjs/common';

/**
 * Services are "injectable", which just means they can be added magically as a class constructor argument.
 * This is how Angular/nestjs handles dependency injection.
 *
 * Read more about dependency injection as a concept here:
 * https://en.wikipedia.org/wiki/Dependency_injection
 *
 * Its used heavily in OOP frameworks such as Spring, or the after-mentioned Angular.
 *
 *
 * This service is left just as an example, and will be removed once there's firmer examples
 */
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
