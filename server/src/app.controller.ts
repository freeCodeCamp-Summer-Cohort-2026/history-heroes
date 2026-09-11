import { Controller, Get, NotFoundException } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Example endpoint, can be loaded from:
   * http://localhost:3000/api/v1/hello-world
   *
   */
  @Get('hello-world')
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * Catch all route if nothing else matches, we return 404
   *
   * **note** this "catchall" is required, but is meaningless (blame express 5)
   * ref:  https://docs.nestjs.com/controllers#route-wildcards
   */
  @Get('*catchall')
  getNotFound() {
    throw new NotFoundException('Route not found');
  }
}
