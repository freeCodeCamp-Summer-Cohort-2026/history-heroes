import { INestApplication } from '@nestjs/common';
import type { App } from 'supertest/types';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { createAuthenticatedAgent, createTestApp } from '../../test/e2e-helper';
import { Lesson } from './entities/lesson.entity';
import { Module as ModuleEntity } from '../modules/entities/module.entity';
import { Activity } from '../activities/entities/activity.entity';
import { LessonActivityAssignment } from '../activities/entities/lesson-activity-assignment.entity';

describe('LessonsController (e2e)', () => {
  let app: INestApplication<App>;
  let lessonRepo: Repository<Lesson>;
  let moduleRepo: Repository<ModuleEntity>;
  let activityRepo: Repository<Activity>;
  let assignmentRepo: Repository<LessonActivityAssignment>;

  beforeEach(async () => {
    app = await createTestApp();
    lessonRepo = app.get(getRepositoryToken(Lesson));
    moduleRepo = app.get(getRepositoryToken(ModuleEntity));
    activityRepo = app.get(getRepositoryToken(Activity));
    assignmentRepo = app.get(getRepositoryToken(LessonActivityAssignment));
  });

  afterEach(async () => {
    if (app) {
      await assignmentRepo.clear();
      await activityRepo.clear();
      await lessonRepo.clear();
      await moduleRepo.delete({ id: Not('seven-wonders') });
      await app.close();
    }
  });

  describe('/api/v1/lessons/:lessonId (GET)', () => {
    it('returns 404 for an unknown lesson', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/lessons/nonexistent-lesson')
        .expect(404);

      expect(response.body.message).toContain(
        'Lesson with ID nonexistent-lesson not found',
      );
    });

    it('returns lesson with empty activities array when lesson has no assigned activities', async () => {
      await lessonRepo.save({
        id: 'empty-lesson',
        moduleId: 'seven-wonders',
        title: 'Empty Lesson',
        description: 'A lesson without activities',
        contents: 'Some text content',
        orderIndex: 1,
      });

      const response = await request(app.getHttpServer())
        .get('/api/v1/lessons/empty-lesson')
        .expect(200);

      expect(response.body).toMatchObject({
        id: 'empty-lesson',
        moduleId: 'seven-wonders',
        title: 'Empty Lesson',
        description: 'A lesson without activities',
        contents: 'Some text content',
        orderIndex: 1,
        activities: [],
      });
    });

    it('returns lesson with ordered activities preserving exact check statement and structured success criteria round-trip', async () => {
      // 1. Create two lessons
      await lessonRepo.save([
        {
          id: 'great-pyramid',
          moduleId: 'seven-wonders',
          title: 'The Great Pyramid of Giza',
          description: 'The oldest of the seven wonders.',
          contents: 'Full detailed lesson content for Great Pyramid...',
          orderIndex: 1,
        },
        {
          id: 'hanging-gardens',
          moduleId: 'seven-wonders',
          title: 'The Hanging Gardens of Babylon',
          description: 'A mysterious wonder.',
          contents: 'Full detailed content for Hanging Gardens...',
          orderIndex: 2,
        },
      ]);

      // 2. Create activities of different types with structured criteria and check statements
      const authoredOrderingStatement =
        'Arrange the construction stages of the Great Pyramid in chronological order.';
      const authoredMatchingStatement =
        'Match each pyramid component with its primary building material.';
      const authoredOtherLessonStatement =
        'Order the historical evidence for the Hanging Gardens.';

      await activityRepo.save([
        {
          id: 'activity-ordering-pyramid',
          title: 'Pyramid Construction Stages',
          type: 'ordering',
          checkStatement: authoredOrderingStatement,
          content: {
            items: [
              { id: 'stage-quarry', label: 'Quarrying limestone blocks' },
              { id: 'stage-transport', label: 'Transporting stones across the Nile' },
              { id: 'stage-core', label: 'Constructing the inner core' },
              { id: 'stage-casing', label: 'Fitting smooth limestone casing' },
            ],
          },
          successCriteria: {
            correctOrder: [
              'stage-quarry',
              'stage-transport',
              'stage-core',
              'stage-casing',
            ],
          },
        },
        {
          id: 'activity-matching-pyramid',
          title: 'Pyramid Materials',
          type: 'matching',
          checkStatement: authoredMatchingStatement,
          content: {
            left: [
              { id: 'core', label: 'Pyramid Core' },
              { id: 'casing', label: 'Exterior Casing' },
            ],
            right: [
              { id: 'rough-stone', label: 'Local rough limestone' },
              { id: 'tura-stone', label: 'Fine white Tura limestone' },
            ],
          },
          successCriteria: {
            pairs: [
              { left: 'core', right: 'rough-stone' },
              { left: 'casing', right: 'tura-stone' },
            ],
          },
        },
        {
          id: 'activity-hanging-gardens',
          title: 'Gardens Evidence',
          type: 'ordering',
          checkStatement: authoredOtherLessonStatement,
          content: {
            items: [{ id: 'doc-1', label: 'Greek accounts' }],
          },
          successCriteria: {
            correctOrder: ['doc-1'],
          },
        },
      ]);

      // 3. Assign activities: insert out of order (orderIndex 2 first, then orderIndex 1)
      // and assign activity-hanging-gardens to the other lesson
      await assignmentRepo.save([
        {
          lessonId: 'great-pyramid',
          activityId: 'activity-matching-pyramid',
          orderIndex: 2,
        },
        {
          lessonId: 'great-pyramid',
          activityId: 'activity-ordering-pyramid',
          orderIndex: 1,
        },
        {
          lessonId: 'hanging-gardens',
          activityId: 'activity-hanging-gardens',
          orderIndex: 1,
        },
      ]);

      // 4. Request lesson
      const response = await request(app.getHttpServer())
        .get('/api/v1/lessons/great-pyramid')
        .expect(200);

      // Verify lesson fields
      expect(response.body.id).toBe('great-pyramid');
      expect(response.body.moduleId).toBe('seven-wonders');
      expect(response.body.title).toBe('The Great Pyramid of Giza');
      expect(response.body.description).toBe('The oldest of the seven wonders.');
      expect(response.body.contents).toBe(
        'Full detailed lesson content for Great Pyramid...',
      );
      expect(response.body.orderIndex).toBe(1);

      // Verify activities: only 2 assigned, excluding hanging-gardens activity
      expect(response.body.activities).toHaveLength(2);

      // Verify ascending order index: orderIndex 1 first, then orderIndex 2
      const firstActivity = response.body.activities[0];
      const secondActivity = response.body.activities[1];

      expect(firstActivity.orderIndex).toBe(1);
      expect(firstActivity.id).toBe('activity-ordering-pyramid');
      expect(firstActivity.title).toBe('Pyramid Construction Stages');
      expect(firstActivity.type).toBe('ordering');
      expect(firstActivity.activityType).toBe('ordering');
      // Exact check statement preservation
      expect(firstActivity.checkStatement).toBe(authoredOrderingStatement);
      // Database round-trip of structured JSON content and success criteria
      expect(firstActivity.content).toEqual({
        items: [
          { id: 'stage-quarry', label: 'Quarrying limestone blocks' },
          { id: 'stage-transport', label: 'Transporting stones across the Nile' },
          { id: 'stage-core', label: 'Constructing the inner core' },
          { id: 'stage-casing', label: 'Fitting smooth limestone casing' },
        ],
      });
      expect(firstActivity.successCriteria).toEqual({
        correctOrder: [
          'stage-quarry',
          'stage-transport',
          'stage-core',
          'stage-casing',
        ],
      });

      expect(secondActivity.orderIndex).toBe(2);
      expect(secondActivity.id).toBe('activity-matching-pyramid');
      expect(secondActivity.title).toBe('Pyramid Materials');
      expect(secondActivity.type).toBe('matching');
      expect(secondActivity.activityType).toBe('matching');
      expect(secondActivity.checkStatement).toBe(authoredMatchingStatement);
      expect(secondActivity.content).toEqual({
        left: [
          { id: 'core', label: 'Pyramid Core' },
          { id: 'casing', label: 'Exterior Casing' },
        ],
        right: [
          { id: 'rough-stone', label: 'Local rough limestone' },
          { id: 'tura-stone', label: 'Fine white Tura limestone' },
        ],
      });
      expect(secondActivity.successCriteria).toEqual({
        pairs: [
          { left: 'core', right: 'rough-stone' },
          { left: 'casing', right: 'tura-stone' },
        ],
      });

      // Confirm other lesson's activity is excluded
      const activityIds = response.body.activities.map((a: { id: string }) => a.id);
      expect(activityIds).not.toContain('activity-hanging-gardens');
    });

    it('is accessible with an authenticated agent as well as unauthenticated', async () => {
      await lessonRepo.save({
        id: 'great-pyramid',
        moduleId: 'seven-wonders',
        title: 'The Great Pyramid of Giza',
        description: 'First wonder',
        contents: 'Lesson contents',
        orderIndex: 1,
      });

      const agent = await createAuthenticatedAgent(app);
      const authResponse = await agent
        .get('/api/v1/lessons/great-pyramid')
        .expect(200);

      expect(authResponse.body.id).toBe('great-pyramid');

      const anonResponse = await request(app.getHttpServer())
        .get('/api/v1/lessons/great-pyramid')
        .expect(200);

      expect(anonResponse.body.id).toBe('great-pyramid');
    });
  });

  describe('/api/v1/lessons/:lessonId/activities (GET)', () => {
    it('returns 404 for an unknown lesson', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/lessons/nonexistent-lesson/activities')
        .expect(404);
    });

    it('returns empty array when lesson has no assigned activities', async () => {
      await lessonRepo.save({
        id: 'empty-lesson',
        moduleId: 'seven-wonders',
        title: 'Empty Lesson',
        description: 'No activities',
        contents: 'Content',
        orderIndex: 1,
      });

      const response = await request(app.getHttpServer())
        .get('/api/v1/lessons/empty-lesson/activities')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('returns ordered activities array directly matching client expectations', async () => {
      await lessonRepo.save({
        id: 'great-pyramid',
        moduleId: 'seven-wonders',
        title: 'The Great Pyramid of Giza',
        description: 'First wonder',
        contents: 'Content',
        orderIndex: 1,
      });

      await activityRepo.save({
        id: 'activity-1',
        title: 'Activity 1',
        type: 'ordering',
        checkStatement: 'Order the items correctly.',
        content: { items: [{ id: 'a', label: 'A' }] },
        successCriteria: { correctOrder: ['a'] },
      });

      await assignmentRepo.save({
        lessonId: 'great-pyramid',
        activityId: 'activity-1',
        orderIndex: 1,
      });

      const response = await request(app.getHttpServer())
        .get('/api/v1/lessons/great-pyramid/activities')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({
        id: 'activity-1',
        title: 'Activity 1',
        type: 'ordering',
        activityType: 'ordering',
        checkStatement: 'Order the items correctly.',
        orderIndex: 1,
      });
    });
  });
});
