import { setupDatabase, clearDatabase, closeDatabase } from './utils/database';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Groups API (e2e)', () => {
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

  it('should create a new group', async () => {
    const response = await request(app.getHttpServer())
      .post('/groups')
      .send({ title: 'Group A' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('title', 'Group A');
  });

  it('should not create a group with an empty title', async () => {
    await request(app.getHttpServer())
      .post('/groups')
      .send({ title: '' })
      .expect(400);
  });

  it('should add a user to a group', async () => {
    const groupResponse = await request(app.getHttpServer())
      .post('/groups')
      .send({ title: 'Group A' })
      .expect(201);

    const userResponse = await request(app.getHttpServer())
      .post('/users')
      .send({ username: 'john' })
      .expect(201);

    const groupId = groupResponse.body.id;
    const userId = userResponse.body.id;

    await request(app.getHttpServer())
      .put(`/groups/${groupId}/users/${userId}`)
      .expect(200);
  });

  it('should return 404 when adding a user to a non-existent group', async () => {
    const userResponse = await request(app.getHttpServer())
      .post('/users')
      .send({ username: 'john' })
      .expect(201);

    const userId = userResponse.body.id;

    await request(app.getHttpServer())
      .put(`/groups/9999/users/${userId}`)
      .expect(404);
  });
});
