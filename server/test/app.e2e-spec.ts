import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import helmet from 'helmet';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(helmet());
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  it('/api/v1/hello-world (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/hello-world')
      .expect(200)
      .expect('Hello World!');
  });

  it('/api/v1/users/me (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/users/me')
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe('test-user');
    expect(response.body.email).toBe('test@historyheroes.org');
    // Ensure password is not exposed
    expect(response.body.password).toBeUndefined();
  });

  it('/api/v1/modules (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/modules')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toMatchObject({
      id: 'seven-wonders',
      title: 'Seven Wonders',
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
