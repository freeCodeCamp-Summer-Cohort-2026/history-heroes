import { DataSource } from 'typeorm';
import { Module } from '../src/modules/entities/module.entity';
import { Lesson } from '../src/lessons/entities/lesson.entity';
import { Activity } from '../src/activities/entities/activity.entity';
import { LessonActivityAssignment } from '../src/activities/entities/lesson-activity-assignment.entity';

describe('LessonActivityAssignment entity', () => {
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = new DataSource({
      type: 'better-sqlite3',
      database: ':memory:',
      entities: [Module, Lesson, Activity, LessonActivityAssignment],
      synchronize: true,
    });

    await dataSource.initialize();
    await dataSource.query('PRAGMA foreign_keys = ON');

    await dataSource.getRepository(Module).save({
      id: 'ancient-rome',
      title: 'Ancient Rome',
      description: 'Lessons on Roman history.',
      period: 'Classical',
      theme: 'Politics',
      order: 1,
    });

    await dataSource.getRepository(Lesson).save({
      id: 'lesson-foundation',
      moduleId: 'ancient-rome',
      title: 'Founding of Rome',
      description: 'How Rome began as a city.',
      contents: 'Rome began as a settlement on the Tiber.',
      orderIndex: 1,
    });

    await dataSource.getRepository(Activity).save([
      {
        id: 'order-roman-events',
        title: 'Order the Roman events',
        type: 'ordering',
        checkStatement: 'We checked the order of the events.',
        content: { items: [{ id: 'a', label: 'Founding' }] },
        successCriteria: { correctOrder: ['a'] },
      },
      {
        id: 'match-roman-roles',
        title: 'Match the Roman roles',
        type: 'matching',
        checkStatement: 'We checked each pair.',
        content: {
          left: [{ id: 'l', label: 'Consul' }],
          right: [{ id: 'r', label: 'Leads the republic' }],
        },
        successCriteria: { pairs: [{ left: 'l', right: 'r' }] },
      },
    ]);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  it('refuses two activities with the same order index in one lesson', async () => {
    const assignments = dataSource.getRepository(LessonActivityAssignment);

    await assignments.save({
      lessonId: 'lesson-foundation',
      activityId: 'order-roman-events',
      orderIndex: 1,
    });

    await expect(
      assignments.save({
        lessonId: 'lesson-foundation',
        activityId: 'match-roman-roles',
        orderIndex: 1,
      }),
    ).rejects.toThrow();
  });

  it('allows the same order index in two different lessons', async () => {
    await dataSource.getRepository(Lesson).save({
      id: 'lesson-republic',
      moduleId: 'ancient-rome',
      title: 'Roman Republic',
      description: 'The Roman Republic rises.',
      contents: 'The republic expanded through political reform.',
      orderIndex: 2,
    });

    const assignments = dataSource.getRepository(LessonActivityAssignment);

    await assignments.save({
      lessonId: 'lesson-foundation',
      activityId: 'order-roman-events',
      orderIndex: 1,
    });

    await assignments.save({
      lessonId: 'lesson-republic',
      activityId: 'match-roman-roles',
      orderIndex: 1,
    });

    const stored = await assignments.find();

    expect(stored).toHaveLength(2);
  });
});
