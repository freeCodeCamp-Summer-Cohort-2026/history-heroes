import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    // more opinionated route config routeConflictPolicy
    // ref: https://docs.nestjs.com/controllers#route-conflicts-and-resolution-order
    routeConflictPolicy: { duplicate: 'error', shadow: 'warn' },
    // this is required to have non-wildcard routes (the catchall) override the wildcard route, otherwise the catchall will always be used
    routeResolutionStrategy: 'specificity',
  });

  const config = new DocumentBuilder()
    .setTitle('History Heroes API')
    .setDescription('History Heroes API description')
    .setVersion('1.0')
    .addTag('history-heroes')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.use(helmet());
  app.setGlobalPrefix('api/v1');

  const configService = app.get(ConfigService);

  const port = parseInt(configService.get<string>('PORT', '3000'), 10);

  await app.listen(port);
  logger.log(`Application is running on port: ${port}`);
}
void bootstrap();
