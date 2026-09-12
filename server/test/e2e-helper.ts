import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import helmet from 'helmet';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

/**
 * Helper function used for e2e tests, which utilizes supertest for direct API calls.
 */
export async function createTestApp(): Promise<INestApplication<App>> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.use(helmet());
  app.setGlobalPrefix('api/v1');
  await app.init();
  return app;
}

export async function createAuthenticatedAgent(
  app: INestApplication<App>,
  credentials = {
    email: 'test@historyheroes.org',
    password: 'local-dev-only',
  },
) {
  const agent = request.agent(app.getHttpServer());
  await agent.post('/api/v1/auth/login').send(credentials).expect(201);
  return agent;
}
