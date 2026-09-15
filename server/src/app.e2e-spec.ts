import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types';
import { createTestApp } from '../test/e2e-helper';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await createTestApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/api/v1/hello-world (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/hello-world')
      .expect(200)
      .expect('Hello World!');
  });

  it('/api/v1/hello-world (GET) applies helmet security headers', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/hello-world')
      .expect(200);

    expect(response.headers['x-content-type-options']).toBe('nosniff');
  });
});
