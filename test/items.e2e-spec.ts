import { setupDatabase, clearDatabase, closeDatabase } from './utils/database';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Items API (e2e)', () => {
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

  it('should create a new item', async () => {
    const response = await request(app.getHttpServer())
      .post('/items')
      .send({ title: 'Item A' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('title', 'Item A');
  });

  it('should not create an item with an empty title', async () => {
    await request(app.getHttpServer())
      .post('/items')
      .send({ title: '' })
      .expect(400);
  });

  it('should fetch unique items by user', async () => {
    const userResponse = await request(app.getHttpServer())
      .post('/users')
      .send({ username: 'john' })
      .expect(201);

    const userId = userResponse.body.id;

    const groupResponse = await request(app.getHttpServer())
      .post('/groups')
      .send({ title: 'Group A' })
      .expect(201);

    const groupId = groupResponse.body.id;

    const itemResponse1 = await request(app.getHttpServer())
      .post('/items')
      .send({ title: 'Item A' })
      .expect(201);

    const itemResponse2 = await request(app.getHttpServer())
      .post('/items')
      .send({ title: 'Item B' })
      .expect(201);

    const itemId1 = itemResponse1.body.id;
    const itemId2 = itemResponse2.body.id;

    await request(app.getHttpServer())
      .put(`/groups/${groupId}/items/${itemId1}`)
      .expect(200);

    await request(app.getHttpServer())
      .put(`/groups/${groupId}/items/${itemId2}`)
      .expect(200);

    await request(app.getHttpServer())
      .put(`/groups/${groupId}/users/${userId}`)
      .expect(200);

    const response = await request(app.getHttpServer())
      .get('/items?username=john')
      .expect(200);

    expect(response.body).toEqual(expect.arrayContaining(['Item A', 'Item B']));
  });

  it('should return 404 if user does not exist when fetching items', async () => {
    await request(app.getHttpServer())
      .get('/items?username=nonexistentuser')
      .expect(404);
  });
});
