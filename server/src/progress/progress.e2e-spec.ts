import { INestApplication } from '@nestjs/common';
import type { App } from 'supertest/types';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createAuthenticatedAgent, createTestApp } from '../../test/e2e-helper';
import { UserLessonProgress } from './entities/user-lesson-progress.entity';
import { UserLabProgress } from './entities/user-lab-progress.entity';

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

    await agent.post('/api/v1/progress/lessons/nonexistent-lesson').expect(404);

    await agent.put('/api/v1/progress/lessons/nonexistent-lesson').expect(404);

    await agent.get('/api/v1/progress/lessons/nonexistent-lesson').expect(404);
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
    await agentA.post('/api/v1/progress/lessons/great-pyramid').expect(201);

    // Learner B completes hanging-gardens
    await agentB.post('/api/v1/progress/lessons/hanging-gardens').expect(201);

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

  it('tests session progress retrieval across app restart', async () => {
    const agentA = request.agent(app.getHttpServer());

    const postResponse = await agentA
      .post('/api/v1/progress/lessons/great-pyramid')
      .expect(201);

    const cookie = postResponse.headers['set-cookie'];
    expect(cookie).toBeDefined();

    await app.close();

    app = await createTestApp();

    const agentB = request.agent(app.getHttpServer());

    const getResponse = await agentB
      .get('/api/v1/progress')
      .set('Cookie', cookie[0])
      .expect(200);
    expect(getResponse.body).toHaveLength(1);
    expect(getResponse.body[0].lessonId).toBe('great-pyramid');
  });

  it('/api/v1/progress/labs/:labId (GET) returns 404 for uncompleted lab', async () => {
    const agent = request.agent(app.getHttpServer());

    await agent.get('/api/v1/progress/labs/uncompleted-lab').expect(404);
  });

  it('/api/v1/progress/labs/:labId (POST) saves progress and GET retrieves it with completion timestamp', async () => {
    const agent = request.agent(app.getHttpServer());

    const postResponse = await agent
      .post('/api/v1/progress/labs/great-pyramid-lab')
      .expect(201);

    expect(postResponse.body).toMatchObject({
      labId: 'great-pyramid-lab',
    });
    expect(postResponse.body.completedAt).toBeDefined();

    const getResponse = await agent
      .get('/api/v1/progress/labs/great-pyramid-lab')
      .expect(200);

    expect(getResponse.body).toMatchObject({
      labId: 'great-pyramid-lab',
      id: postResponse.body.id,
    });
    expect(getResponse.body.completedAt).toBe(postResponse.body.completedAt);

    // Idempotent repetition check: saving again does not create a duplicate
    const repeatPost = await agent
      .post('/api/v1/progress/labs/great-pyramid-lab')
      .expect(201);

    expect(repeatPost.body.id).toBe(postResponse.body.id);

    const getResponseAfterRepeat = await agent
      .get('/api/v1/progress/labs/great-pyramid-lab')
      .expect(200);
    expect(getResponseAfterRepeat.body.id).toBe(postResponse.body.id);
  });

  it('/api/v1/progress/labs/:labId (PUT) saves lab progress idempotently', async () => {
    const agent = request.agent(app.getHttpServer());

    const putResponse = await agent
      .put('/api/v1/progress/labs/hanging-gardens-lab')
      .expect(200);

    expect(putResponse.body).toMatchObject({
      labId: 'hanging-gardens-lab',
    });
    expect(putResponse.body.completedAt).toBeDefined();

    const getResponse = await agent
      .get('/api/v1/progress/labs/hanging-gardens-lab')
      .expect(200);
    expect(getResponse.body.labId).toBe('hanging-gardens-lab');
  });

  it('enforces learner isolation for lab completion: two distinct learners do not see each other lab progress', async () => {
    const agentA = await createAuthenticatedAgent(app, {
      email: 'test@historyheroes.org',
      password: 'local-dev-only',
    });

    const agentB = await createAuthenticatedAgent(app, {
      email: 'admin@historyheroes.org',
      password: 'local-dev-only',
    });

    // Learner A completes great-pyramid-lab
    await agentA.post('/api/v1/progress/labs/great-pyramid-lab').expect(201);

    // Learner B completes hanging-gardens-lab
    await agentB.post('/api/v1/progress/labs/hanging-gardens-lab').expect(201);

    // Learner A sees great-pyramid-lab, but gets 404 for hanging-gardens-lab
    const responseA = await agentA
      .get('/api/v1/progress/labs/great-pyramid-lab')
      .expect(200);
    expect(responseA.body.labId).toBe('great-pyramid-lab');
    await agentA.get('/api/v1/progress/labs/hanging-gardens-lab').expect(404);

    // Learner B sees hanging-gardens-lab, but gets 404 for great-pyramid-lab
    const responseB = await agentB
      .get('/api/v1/progress/labs/hanging-gardens-lab')
      .expect(200);
    expect(responseB.body.labId).toBe('hanging-gardens-lab');
    await agentB.get('/api/v1/progress/labs/great-pyramid-lab').expect(404);
  });

  it('tests session lab progress retrieval across app restart (earlier session completion in later session)', async () => {
    const agentA = request.agent(app.getHttpServer());

    const postResponse = await agentA
      .post('/api/v1/progress/labs/session-lab-test')
      .expect(201);

    const cookie = postResponse.headers['set-cookie'];
    expect(cookie).toBeDefined();

    await app.close();

    app = await createTestApp();

    const agentB = request.agent(app.getHttpServer());

    const getResponse = await agentB
      .get('/api/v1/progress/labs/session-lab-test')
      .set('Cookie', cookie[0])
      .expect(200);
    expect(getResponse.body.labId).toBe('session-lab-test');
    expect(getResponse.body.completedAt).toBe(postResponse.body.completedAt);
  });

  it('enforces database uniqueness constraint on (userId, labId)', async () => {
    const labProgressRepo: Repository<UserLabProgress> = app.get(
      getRepositoryToken(UserLabProgress),
    );

    const record1 = labProgressRepo.create({
      userId: 888,
      labId: 'unique-lab-test',
    });
    await labProgressRepo.save(record1);

    const duplicate = labProgressRepo.create({
      userId: 888,
      labId: 'unique-lab-test',
    });

    await expect(labProgressRepo.insert(duplicate)).rejects.toThrow();
  });
});
