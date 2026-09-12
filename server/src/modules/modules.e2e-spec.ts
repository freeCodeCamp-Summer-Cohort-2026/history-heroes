import { INestApplication } from '@nestjs/common';
import type { App } from 'supertest/types';
import { createAuthenticatedAgent, createTestApp } from '../../test/e2e-helper';

describe('ModulesController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await createTestApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/api/v1/modules (GET) with authenticated session', async () => {
    const agent = await createAuthenticatedAgent(app);

    const response = await agent.get('/api/v1/modules').expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toMatchObject({
      id: 'seven-wonders',
      title: 'Seven Wonders',
    });
  });
});
