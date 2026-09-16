import { INestApplication } from '@nestjs/common';
import type { App } from 'supertest/types';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { createAuthenticatedAgent, createTestApp } from '../../test/e2e-helper';
import { Lesson } from '../lessons/entities/lesson.entity';
import { Module as ModuleEntity } from './entities/module.entity';

describe('ModulesController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await createTestApp();
  });

  afterEach(async () => {
    if (app) {
      const lessonRepo: Repository<Lesson> = app.get(
        getRepositoryToken(Lesson),
      );
      await lessonRepo.clear();
      const moduleRepo: Repository<ModuleEntity> = app.get(
        getRepositoryToken(ModuleEntity),
      );
      await moduleRepo.delete({ id: Not('seven-wonders') });
      await app.close();
    }
  });

  it('/api/v1/modules (GET) with authenticated session', async () => {
    const agent = await createAuthenticatedAgent(app);

    const response = await agent.get('/api/v1/modules').expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toMatchObject({
      id: 'seven-wonders',
      title: 'The Seven Wonders of the Ancient World',
    });
  });

  describe('/api/v1/modules/:moduleId/lessons (GET)', () => {
    it('returns a valid empty collection when a module has no lessons', async () => {
      const agent = await createAuthenticatedAgent(app);

      const response = await agent
        .get('/api/v1/modules/seven-wonders/lessons')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('returns 404 for an unknown module', async () => {
      const agent = await createAuthenticatedAgent(app);

      await agent.get('/api/v1/modules/nonexistent-module/lessons').expect(404);
    });

    it('returns lessons in ascending order_index order with required fields', async () => {
      const agent = await createAuthenticatedAgent(app);
      const lessonRepo: Repository<Lesson> = app.get(
        getRepositoryToken(Lesson),
      );

      // Insert lessons out of order
      await lessonRepo.save([
        {
          id: 'hanging-gardens',
          moduleId: 'seven-wonders',
          title: 'The Hanging Gardens of Babylon',
          description: 'Second wonder lesson',
          contents: 'Content for Hanging Gardens',
          orderIndex: 2,
        },
        {
          id: 'great-pyramid',
          moduleId: 'seven-wonders',
          title: 'The Great Pyramid of Giza',
          description: 'First wonder lesson',
          contents: 'Content for Great Pyramid',
          orderIndex: 1,
        },
      ]);

      const response = await agent
        .get('/api/v1/modules/seven-wonders/lessons')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toMatchObject({
        id: 'great-pyramid',
        moduleId: 'seven-wonders',
        title: 'The Great Pyramid of Giza',
        orderIndex: 1,
      });
      expect(response.body[1]).toMatchObject({
        id: 'hanging-gardens',
        moduleId: 'seven-wonders',
        title: 'The Hanging Gardens of Babylon',
        orderIndex: 2,
      });

      // Verify repeated requests return the same sequence
      const repeatedResponse = await agent
        .get('/api/v1/modules/seven-wonders/lessons')
        .expect(200);
      expect(repeatedResponse.body).toEqual(response.body);
    });

    it('excludes lessons belonging to other modules', async () => {
      const agent = await createAuthenticatedAgent(app);
      const moduleRepo: Repository<ModuleEntity> = app.get(
        getRepositoryToken(ModuleEntity),
      );
      const lessonRepo: Repository<Lesson> = app.get(
        getRepositoryToken(Lesson),
      );

      // Create a second module
      await moduleRepo.save({
        id: 'renaissance-art',
        title: 'Renaissance Art',
        description: 'Explore the Renaissance period',
        order: 2,
      });

      // Seed lessons for both modules
      await lessonRepo.save([
        {
          id: 'great-pyramid',
          moduleId: 'seven-wonders',
          title: 'The Great Pyramid of Giza',
          description: 'Seven wonders lesson',
          contents: 'Pyramid content',
          orderIndex: 1,
        },
        {
          id: 'mona-lisa',
          moduleId: 'renaissance-art',
          title: 'The Mona Lisa',
          description: 'Renaissance lesson',
          contents: 'Mona Lisa content',
          orderIndex: 1,
        },
      ]);

      const response = await agent
        .get('/api/v1/modules/seven-wonders/lessons')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].id).toBe('great-pyramid');
      expect(response.body[0].moduleId).toBe('seven-wonders');
    });

    it('accessible without authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/modules/seven-wonders/lessons')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });
});
