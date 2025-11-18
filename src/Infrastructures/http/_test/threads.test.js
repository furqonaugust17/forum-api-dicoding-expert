const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      const requestPayload = {
        title: 'Thread 1',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ex libero, semper eget nibh sed, molestie imperdiet quam.',
      };

      const server = await createServer(container);

      const { accessToken } = await AuthenticationsTableTestHelper.createToken(server);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 401 when access token doesnt exist', async () => {
      const requestPayload = {
        title: 'Thread 1',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ex libero, semper eget nibh sed, molestie imperdiet quam.',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 when not did not contain needed property', async () => {
      const requestPayload = {
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ex libero, semper eget nibh sed, molestie imperdiet quam.',
      };

      const server = await createServer(container);

      const { accessToken } = await AuthenticationsTableTestHelper.createToken(server);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });
    it('should response 400 when not meet data type specification', async () => {
      const requestPayload = {
        title: 123,
        body: true,
      };

      const server = await createServer(container);

      const { accessToken } = await AuthenticationsTableTestHelper.createToken(server);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and return thread detail with comments', async () => {
      const server = await createServer(container);

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'furqon' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-123',
        created_at: '2025-11-01T02:00:00.000Z',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        content: 'sebuah komentar',
        owner: 'user-123',
        created_at: '2025-11-01T03:00:00.000Z',
        is_delete: null,
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-456',
        threadId: 'thread-123',
        content: 'komentar terhapus',
        owner: 'user-123',
        created_at: '2025-11-01T04:00:00.000Z',
        is_delete: '2025-11-01T05:00:00.000Z',
      });

      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(2);
    });

    it('should response 404 when thread not found', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-not-found',
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread Tidak Ditemukan');
    });
  });
});
