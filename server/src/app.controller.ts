import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Example endpoint, can be loaded from:
   * https://localhost:3000/api/v1/hello-world
   *
   */
  @Get('hello-world')
  getHello(): string {
    return this.appService.getHello();
  }
}
