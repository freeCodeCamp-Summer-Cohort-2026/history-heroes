import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1790917247660 implements MigrationInterface {
  name = 'InitialSchema1790917247660';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "activities" ("id" varchar(100) PRIMARY KEY NOT NULL, "title" varchar(255) NOT NULL, "activity_type" varchar(50) NOT NULL, "check_statement" text NOT NULL, "content" jsonb NOT NULL, "success_criteria" jsonb NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `CREATE TABLE "labs" ("id" varchar(50) PRIMARY KEY NOT NULL, "module_id" varchar(50) NOT NULL, "title" varchar(100) NOT NULL, "description" varchar(255) NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE TABLE "lab_activity_assignments" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "lab_id" varchar(100) NOT NULL, "activity_id" varchar(100) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0d7896e0b5acf7174d436d4ef0" ON "lab_activity_assignments" ("lab_id", "activity_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "modules" ("id" varchar(50) PRIMARY KEY NOT NULL, "title" varchar(100) NOT NULL, "description" varchar(255) NOT NULL, "period" varchar(100), "theme" varchar(100), "order" integer NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `CREATE TABLE "lessons" ("id" varchar(50) PRIMARY KEY NOT NULL, "moduleId" varchar(50) NOT NULL, "title" varchar(100) NOT NULL, "description" varchar(255) NOT NULL, "contents" text NOT NULL, "orderIndex" integer NOT NULL, CONSTRAINT "UQ_lessons_module_order_index" UNIQUE ("moduleId", "orderIndex"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "lesson_activity_assignments" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "lesson_id" varchar(100) NOT NULL, "activity_id" varchar(100) NOT NULL, "order_index" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_742af922147cb7543c66e38910a" UNIQUE ("lesson_id", "order_index"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_742af922147cb7543c66e38910" ON "lesson_activity_assignments" ("lesson_id", "order_index") `,
    );
    await queryRunner.query(
      `CREATE TABLE "sessions" ("id" varchar(255) PRIMARY KEY NOT NULL, "userId" integer, "data" jsonb NOT NULL, "expiresAt" bigint NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3238ef96f18b355b671619111b" ON "sessions" ("id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_57de40bc620f456c7311aa3a1e" ON "sessions" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_50762206f116cd47d1c3fec396" ON "sessions" ("expiresAt") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user_lab_progress" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "labId" varchar(100) NOT NULL, "userId" integer, "sessionId" varchar(255), "completedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_1e8fd55afa3eb21713bc2db8455" UNIQUE ("sessionId", "labId"), CONSTRAINT "UQ_b28cbb7396534cc42e1f78976fc" UNIQUE ("userId", "labId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9ff381bc6abb197e6432c73eeb" ON "user_lab_progress" ("labId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ce78277dd11cff992a0b8df8cb" ON "user_lab_progress" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_95409fbc6453d6a563444baff7" ON "user_lab_progress" ("sessionId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1e8fd55afa3eb21713bc2db845" ON "user_lab_progress" ("sessionId", "labId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b28cbb7396534cc42e1f78976f" ON "user_lab_progress" ("userId", "labId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user_lesson_progress" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "lessonId" varchar(100) NOT NULL, "userId" integer, "sessionId" varchar(255), "completedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_b3006a33c883aa4c830d3811de5" UNIQUE ("userId", "lessonId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_881fed870b83f86385c3d94523" ON "user_lesson_progress" ("lessonId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_27792bdc478c840e0b84095bf9" ON "user_lesson_progress" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e62b2f96173c066a47edb92c7a" ON "user_lesson_progress" ("sessionId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2ccec833496cbb566adb7e35c9" ON "user_lesson_progress" ("sessionId", "lessonId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b3006a33c883aa4c830d3811de" ON "user_lesson_progress" ("userId", "lessonId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`,
    );
    await queryRunner.query(`DROP INDEX "IDX_0d7896e0b5acf7174d436d4ef0"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_lab_activity_assignments" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "lab_id" varchar(100) NOT NULL, "activity_id" varchar(100) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_bfe275df982264664e436716a87" FOREIGN KEY ("lab_id") REFERENCES "labs" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_94d5c16f485c76bd47d652c2b77" FOREIGN KEY ("activity_id") REFERENCES "activities" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_lab_activity_assignments"("id", "lab_id", "activity_id", "createdAt") SELECT "id", "lab_id", "activity_id", "createdAt" FROM "lab_activity_assignments"`,
    );
    await queryRunner.query(`DROP TABLE "lab_activity_assignments"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_lab_activity_assignments" RENAME TO "lab_activity_assignments"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0d7896e0b5acf7174d436d4ef0" ON "lab_activity_assignments" ("lab_id", "activity_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_lessons" ("id" varchar(50) PRIMARY KEY NOT NULL, "moduleId" varchar(50) NOT NULL, "title" varchar(100) NOT NULL, "description" varchar(255) NOT NULL, "contents" text NOT NULL, "orderIndex" integer NOT NULL, CONSTRAINT "UQ_lessons_module_order_index" UNIQUE ("moduleId", "orderIndex"), CONSTRAINT "FK_16e7969589c0b789d9868782259" FOREIGN KEY ("moduleId") REFERENCES "modules" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_lessons"("id", "moduleId", "title", "description", "contents", "orderIndex") SELECT "id", "moduleId", "title", "description", "contents", "orderIndex" FROM "lessons"`,
    );
    await queryRunner.query(`DROP TABLE "lessons"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_lessons" RENAME TO "lessons"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_742af922147cb7543c66e38910"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_lesson_activity_assignments" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "lesson_id" varchar(100) NOT NULL, "activity_id" varchar(100) NOT NULL, "order_index" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_742af922147cb7543c66e38910a" UNIQUE ("lesson_id", "order_index"), CONSTRAINT "FK_3f2cc30dd9d475c1f5f2dff40c3" FOREIGN KEY ("lesson_id") REFERENCES "lessons" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_1906d9a02e1f20260f113a8a8c6" FOREIGN KEY ("activity_id") REFERENCES "activities" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_lesson_activity_assignments"("id", "lesson_id", "activity_id", "order_index", "createdAt") SELECT "id", "lesson_id", "activity_id", "order_index", "createdAt" FROM "lesson_activity_assignments"`,
    );
    await queryRunner.query(`DROP TABLE "lesson_activity_assignments"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_lesson_activity_assignments" RENAME TO "lesson_activity_assignments"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_742af922147cb7543c66e38910" ON "lesson_activity_assignments" ("lesson_id", "order_index") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_742af922147cb7543c66e38910"`);
    await queryRunner.query(
      `ALTER TABLE "lesson_activity_assignments" RENAME TO "temporary_lesson_activity_assignments"`,
    );
    await queryRunner.query(
      `CREATE TABLE "lesson_activity_assignments" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "lesson_id" varchar(100) NOT NULL, "activity_id" varchar(100) NOT NULL, "order_index" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_742af922147cb7543c66e38910a" UNIQUE ("lesson_id", "order_index"))`,
    );
    await queryRunner.query(
      `INSERT INTO "lesson_activity_assignments"("id", "lesson_id", "activity_id", "order_index", "createdAt") SELECT "id", "lesson_id", "activity_id", "order_index", "createdAt" FROM "temporary_lesson_activity_assignments"`,
    );
    await queryRunner.query(
      `DROP TABLE "temporary_lesson_activity_assignments"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_742af922147cb7543c66e38910" ON "lesson_activity_assignments" ("lesson_id", "order_index") `,
    );
    await queryRunner.query(
      `ALTER TABLE "lessons" RENAME TO "temporary_lessons"`,
    );
    await queryRunner.query(
      `CREATE TABLE "lessons" ("id" varchar(50) PRIMARY KEY NOT NULL, "moduleId" varchar(50) NOT NULL, "title" varchar(100) NOT NULL, "description" varchar(255) NOT NULL, "contents" text NOT NULL, "orderIndex" integer NOT NULL, CONSTRAINT "UQ_lessons_module_order_index" UNIQUE ("moduleId", "orderIndex"))`,
    );
    await queryRunner.query(
      `INSERT INTO "lessons"("id", "moduleId", "title", "description", "contents", "orderIndex") SELECT "id", "moduleId", "title", "description", "contents", "orderIndex" FROM "temporary_lessons"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_lessons"`);
    await queryRunner.query(`DROP INDEX "IDX_0d7896e0b5acf7174d436d4ef0"`);
    await queryRunner.query(
      `ALTER TABLE "lab_activity_assignments" RENAME TO "temporary_lab_activity_assignments"`,
    );
    await queryRunner.query(
      `CREATE TABLE "lab_activity_assignments" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "lab_id" varchar(100) NOT NULL, "activity_id" varchar(100) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `INSERT INTO "lab_activity_assignments"("id", "lab_id", "activity_id", "createdAt") SELECT "id", "lab_id", "activity_id", "createdAt" FROM "temporary_lab_activity_assignments"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_lab_activity_assignments"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_0d7896e0b5acf7174d436d4ef0" ON "lab_activity_assignments" ("lab_id", "activity_id") `,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP INDEX "IDX_b3006a33c883aa4c830d3811de"`);
    await queryRunner.query(`DROP INDEX "IDX_2ccec833496cbb566adb7e35c9"`);
    await queryRunner.query(`DROP INDEX "IDX_e62b2f96173c066a47edb92c7a"`);
    await queryRunner.query(`DROP INDEX "IDX_27792bdc478c840e0b84095bf9"`);
    await queryRunner.query(`DROP INDEX "IDX_881fed870b83f86385c3d94523"`);
    await queryRunner.query(`DROP TABLE "user_lesson_progress"`);
    await queryRunner.query(`DROP INDEX "IDX_b28cbb7396534cc42e1f78976f"`);
    await queryRunner.query(`DROP INDEX "IDX_1e8fd55afa3eb21713bc2db845"`);
    await queryRunner.query(`DROP INDEX "IDX_95409fbc6453d6a563444baff7"`);
    await queryRunner.query(`DROP INDEX "IDX_ce78277dd11cff992a0b8df8cb"`);
    await queryRunner.query(`DROP INDEX "IDX_9ff381bc6abb197e6432c73eeb"`);
    await queryRunner.query(`DROP TABLE "user_lab_progress"`);
    await queryRunner.query(`DROP INDEX "IDX_50762206f116cd47d1c3fec396"`);
    await queryRunner.query(`DROP INDEX "IDX_57de40bc620f456c7311aa3a1e"`);
    await queryRunner.query(`DROP INDEX "IDX_3238ef96f18b355b671619111b"`);
    await queryRunner.query(`DROP TABLE "sessions"`);
    await queryRunner.query(`DROP INDEX "IDX_742af922147cb7543c66e38910"`);
    await queryRunner.query(`DROP TABLE "lesson_activity_assignments"`);
    await queryRunner.query(`DROP TABLE "lessons"`);
    await queryRunner.query(`DROP TABLE "modules"`);
    await queryRunner.query(`DROP INDEX "IDX_0d7896e0b5acf7174d436d4ef0"`);
    await queryRunner.query(`DROP TABLE "lab_activity_assignments"`);
    await queryRunner.query(`DROP TABLE "labs"`);
    await queryRunner.query(`DROP TABLE "activities"`);
  }
}
