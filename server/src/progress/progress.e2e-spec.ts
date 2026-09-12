import { INestApplication } from '@nestjs/common';
import type { App } from 'supertest/types';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createAuthenticatedAgent, createTestApp } from '../../test/e2e-helper';
import { UserLessonProgress } from './entities/user-lesson-progress.entity';

describe('ProgressController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await createTestApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/api/v1/progress (GET) returns empty list initially for session', async () => {
    const agent = request.agent(app.getHttpServer());

    const response = await agent.get('/api/v1/progress').expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(0);
  });

  it('/api/v1/progress/lessons/:lessonId (POST & PUT) rejects unknown lesson with 404', async () => {
    const agent = request.agent(app.getHttpServer());

    await agent
      .post('/api/v1/progress/lessons/nonexistent-lesson')
      .expect(404);

    await agent
      .put('/api/v1/progress/lessons/nonexistent-lesson')
      .expect(404);

    await agent
      .get('/api/v1/progress/lessons/nonexistent-lesson')
      .expect(404);
  });

  it('/api/v1/progress/lessons/:lessonId (POST) saves progress and /api/v1/progress (GET) retrieves it', async () => {
    const agent = request.agent(app.getHttpServer());

    const postResponse = await agent
      .post('/api/v1/progress/lessons/great-pyramid')
      .expect(201);

    expect(postResponse.body).toMatchObject({
      lessonId: 'great-pyramid',
    });
    expect(postResponse.body.completedAt).toBeDefined();

    const getResponse = await agent.get('/api/v1/progress').expect(200);

    expect(Array.isArray(getResponse.body)).toBe(true);
    expect(getResponse.body).toHaveLength(1);
    expect(getResponse.body[0]).toMatchObject({
      lessonId: 'great-pyramid',
    });

    // Idempotent repetition check
    const repeatPost = await agent
      .post('/api/v1/progress/lessons/great-pyramid')
      .expect(201);

    expect(repeatPost.body.id).toBe(postResponse.body.id);

    const getResponseAfterRepeat = await agent
      .get('/api/v1/progress')
      .expect(200);
    expect(getResponseAfterRepeat.body).toHaveLength(1);
  });

  it('/api/v1/progress/lessons/:lessonId (PUT) saves progress idempotently', async () => {
    const agent = request.agent(app.getHttpServer());

    const putResponse = await agent
      .put('/api/v1/progress/lessons/hanging-gardens')
      .expect(200);

    expect(putResponse.body).toMatchObject({
      lessonId: 'hanging-gardens',
    });

    const getResponse = await agent
      .get('/api/v1/progress/lessons/hanging-gardens')
      .expect(200);
    expect(getResponse.body.lessonId).toBe('hanging-gardens');
  });

  it('enforces learner isolation: two distinct learners do not see each other progress', async () => {
    const agentA = await createAuthenticatedAgent(app, {
      email: 'test@historyheroes.org',
      password: 'local-dev-only',
    });

    const agentB = await createAuthenticatedAgent(app, {
      email: 'admin@historyheroes.org',
      password: 'local-dev-only',
    });

    // Learner A completes great-pyramid
    await agentA
      .post('/api/v1/progress/lessons/great-pyramid')
      .expect(201);

    // Learner B completes hanging-gardens
    await agentB
      .post('/api/v1/progress/lessons/hanging-gardens')
      .expect(201);

    // Verify Learner A only sees great-pyramid
    const responseA = await agentA.get('/api/v1/progress').expect(200);
    expect(responseA.body).toHaveLength(1);
    expect(responseA.body[0].lessonId).toBe('great-pyramid');

    // Verify Learner B only sees hanging-gardens
    const responseB = await agentB.get('/api/v1/progress').expect(200);
    expect(responseB.body).toHaveLength(1);
    expect(responseB.body[0].lessonId).toBe('hanging-gardens');
  });

  it('enforces database uniqueness constraint on (userId, lessonId)', async () => {
    const progressRepo: Repository<UserLessonProgress> = app.get(
      getRepositoryToken(UserLessonProgress),
    );

    const record1 = progressRepo.create({
      userId: 999,
      lessonId: 'great-pyramid',
    });
    await progressRepo.save(record1);

    // Attempt to insert duplicate record with same userId and lessonId
    const duplicate = progressRepo.create({
      userId: 999,
      lessonId: 'great-pyramid',
    });

    await expect(progressRepo.insert(duplicate)).rejects.toThrow();
  });
});
