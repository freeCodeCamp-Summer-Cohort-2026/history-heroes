import { INestApplication } from '@nestjs/common';
import { Lab } from './entities/lab.entity';
import { App } from 'supertest/types';
import { Repository } from 'typeorm';
import { createTestApp } from '../../test/e2e-helper';
import { getRepositoryToken } from '@nestjs/typeorm';
import labsJson from '../../data/seeds/initial-labs.json';
import request from 'supertest';
import { Activity } from '../activities/entities/activity.entity';

describe('Labs controller', () => {
  const seedLabs = labsJson.labs;
  let app: INestApplication<App>;
  let labRepo: Repository<Lab>;
  let activitiesRepo: Repository<Activity>;

  beforeEach(async () => {
    app = await createTestApp();
    labRepo = app.get(getRepositoryToken(Lab));
    activitiesRepo = app.get(getRepositoryToken(Activity));
  });

  afterEach(async () => {
    if (app) {
      await labRepo.clear();
      await activitiesRepo.clear();
      await app.close();
    }
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

    // console.log(resLab.activities);

    expect(resLab.activities.length).toBeGreaterThan(0);
  });
});
