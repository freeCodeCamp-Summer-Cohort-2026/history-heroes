import { DataSource } from 'typeorm';
import { Module } from '../src/modules/entities/module.entity';
import { Lesson } from '../src/modules/entities/lesson.entity';

describe('Lesson entity', () => {
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = new DataSource({
      type: 'better-sqlite3',
      database: ':memory:',
      entities: [Module, Lesson],
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
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  it('stores a lesson under an existing module', async () => {
    const lessons = dataSource.getRepository(Lesson);

    await lessons.save({
      id: 'lesson-foundation',
      moduleId: 'ancient-rome',
      title: 'Founding of Rome',
      description: 'How Rome began as a city.',
      contents: 'Rome began as a settlement on the Tiber.',
      orderIndex: 1,
    });

    const stored = await lessons.findOneBy({ LessonId: 'lesson-foundation' });

    expect(stored).not.toBeNull();
    expect(stored?.moduleId).toBe('ancient-rome');
    expect(stored?.orderIndex).toBe(1);
  });

  it('stores multiple lessons in the same module', async () => {
    const lessons = dataSource.getRepository(Lesson);

    await lessons.save({
      id: 'lesson-foundation',
      moduleId: 'ancient-rome',
      title: 'Founding of Rome',
      description: 'How Rome began as a city.',
      contents: 'Rome began as a settlement on the Tiber.',
      orderIndex: 1,
    });

    await lessons.save({
      id: 'lesson-republic',
      moduleId: 'ancient-rome',
      title: 'Roman Republic',
      description: 'The Roman Republic rises.',
      contents: 'The republic expanded through political reform.',
      orderIndex: 2,
    });

    const stored = await lessons.findBy({ moduleId: 'ancient-rome' });

    expect(stored).toHaveLength(2);
  });

  it('refuses two lessons with the same order index in one module', async () => {
    const lessons = dataSource.getRepository(Lesson);

    await lessons.save({
      id: 'lesson-foundation',
      moduleId: 'ancient-rome',
      title: 'Founding of Rome',
      description: 'How Rome began as a city.',
      contents: 'Rome began as a settlement on the Tiber.',
      orderIndex: 1,
    });

    await expect(
      lessons.save({
        id: 'lesson-duplicate',
        moduleId: 'ancient-rome',
        title: 'Duplicate lesson',
        description: 'Another lesson with same order.',
        contents: 'This should fail.',
        orderIndex: 1,
      }),
    ).rejects.toThrow();
  });

  it('allows the same order index in two different modules', async () => {
    await dataSource.getRepository(Module).save({
      id: 'medieval-europe',
      title: 'Medieval Europe',
      description: 'European history in the Middle Ages.',
      period: 'Medieval',
      theme: 'Society',
      order: 2,
    });

    const lessons = dataSource.getRepository(Lesson);

    await lessons.save({
      id: 'lesson-foundation',
      moduleId: 'ancient-rome',
      title: 'Founding of Rome',
      description: 'How Rome began as a city.',
      contents: 'Rome began as a settlement on the Tiber.',
      orderIndex: 1,
    });

    await lessons.save({
      id: 'lesson-castles',
      moduleId: 'medieval-europe',
      title: 'Castles',
      description: 'How castles shaped medieval life.',
      contents: 'Castles were centers of power and defense.',
      orderIndex: 1,
    });

    const stored = await lessons.find();

    expect(stored).toHaveLength(2);
  });

  it('refuses a lesson pointing at a module that does not exist', async () => {
    const lessons = dataSource.getRepository(Lesson);

    await expect(
      lessons.save({
        id: 'orphan-lesson',
        moduleId: 'missing-module',
        title: 'Missing Module Lesson',
        description: 'Should fail because module does not exist.',
        contents: 'This lesson has no valid module.',
        orderIndex: 1,
      }),
    ).rejects.toThrow();
  });
});