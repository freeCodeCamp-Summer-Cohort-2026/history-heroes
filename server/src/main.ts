import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT', 3000);
  const databaseUrl = configService.get<string>('DATABASE_URL');

  // TODO: Remove temporary DATABASE_URL startup log once SQLite is onboarded, this is just an example of using the config service, and getting stuff from "outside" of nest
  logger.log(`DATABASE_URL: ${databaseUrl}`);

  await app.listen(port);
  logger.log(`Application is running on port: ${port}`);
}
void bootstrap();
