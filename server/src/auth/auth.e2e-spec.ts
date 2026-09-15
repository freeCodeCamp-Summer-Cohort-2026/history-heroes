import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types';
import { createAuthenticatedAgent, createTestApp } from '../../test/e2e-helper';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await createTestApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/api/v1/auth/login (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'test@historyheroes.org',
        password: 'local-dev-only',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe('test@historyheroes.org');
    expect(response.body.password).toBeUndefined();
    expect(response.headers['set-cookie']).toBeDefined();
  });

  it('/api/v1/auth/register (POST)', async () => {
    const uniqueEmail = `user-${Date.now()}@historyheroes.org`;
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: uniqueEmail,
        password: 'password123',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe(uniqueEmail);
    expect(response.headers['set-cookie']).toBeDefined();
  });

  it('/api/v1/auth/logout (POST)', async () => {
    const agent = await createAuthenticatedAgent(app);

    const response = await agent.post('/api/v1/auth/logout').expect(201);
    expect(response.body).toEqual({ message: 'Logged out successfully' });
  });

  it('/api/v1/auth/session (GET)', async () => {
    const agent = await createAuthenticatedAgent(app);

    const response = await agent.get('/api/v1/auth/session').expect(200);
    expect(response.body.session_info).toHaveProperty('userId');
  });
});
