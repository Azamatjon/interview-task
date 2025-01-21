import { setupDatabase, clearDatabase, closeDatabase } from './utils/database';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Users API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    await setupDatabase();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
    await app.close();
  });

  it('should create a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({ username: 'john' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('username', 'john');
  });

  it('should not create a user with an empty username', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({ username: '' })
      .expect(400);
  });
});
