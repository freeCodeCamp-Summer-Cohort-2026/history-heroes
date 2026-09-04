import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.setGlobalPrefix('api/v1');

  const configService = app.get(ConfigService);

  const port = parseInt(configService.get<string>('PORT', '3000'), 10);

  await app.listen(port);
  logger.log(`Application is running on port: ${port}`);
}
void bootstrap();
