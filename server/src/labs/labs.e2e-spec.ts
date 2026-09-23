import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { createTestApp } from '../../test/e2e-helper';
import labsJson from '../../data/seeds/initial-labs.json';
import request from 'supertest';

describe('Labs controller', () => {
  const seedLabs = labsJson.labs;
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await createTestApp();
  });

  afterEach(async () => {
    if (app) await app.close();
  });

  it('GET labs/:moduleId should return a lab with a populated activities array', async () => {
    const response = await request(app.getHttpServer()).get(
      `/api/v1/labs/${seedLabs[0].moduleId}`,
    );

    const resLab = JSON.parse(response.text);

    expect(resLab.id).toBeDefined();
    expect(resLab.moduleId).toBeDefined();
    expect(resLab.description).toBeDefined();
    expect(resLab.title).toBeDefined();

    expect(resLab.activities.length).toBeGreaterThan(0);
  });
});
