

import request from 'supertest';
import { app, startServer, stopServer } from '../../index';

let server: ReturnType<typeof startServer>;

beforeAll(() => {
  server = startServer(0);
});

afterAll(async () => {
  await stopServer(server);
});

describe('Integration: GET /ping', () => {
  it('responds with pong', async () => {
    await request(app)
      .get('/ping')
      .expect(200, 'pong');
  });
});