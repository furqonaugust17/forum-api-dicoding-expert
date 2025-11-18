const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      const requestPayload = {
        content: 'comment1',
      };

      const server = await createServer(container);

      const { accessToken, id } = await AuthenticationsTableTestHelper.createToken(server);
      await ThreadsTableTestHelper.addThread({ owner: id });

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 404 when thread doesnt exist', async () => {
      const requestPayload = {
        content: 'comment1',
      };

      const server = await createServer(container);

      const { accessToken, id } = await AuthenticationsTableTestHelper.createToken(server);
      await ThreadsTableTestHelper.addThread({ owner: id });

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-125/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread Tidak Ditemukan');
    });

    it('should response 400 when not did not contain needed property', async () => {
      const requestPayload = {
      };

      const server = await createServer(container);

      const { accessToken, id } = await AuthenticationsTableTestHelper.createToken(server);
      await ThreadsTableTestHelper.addThread({ owner: id });

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada');
    });
    it('should response 400 when not meet data type specification', async () => {
      const requestPayload = {
        content: 123,
      };

      const server = await createServer(container);

      const { accessToken, id } = await AuthenticationsTableTestHelper.createToken(server);
      await ThreadsTableTestHelper.addThread({ owner: id });

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena tipe data tidak sesuai');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 when delete comment', async () => {
      const server = await createServer(container);

      const { accessToken, id } = await AuthenticationsTableTestHelper.createToken(server);
      await ThreadsTableTestHelper.addThread({ owner: id });
      await CommentsTableTestHelper.addComment({ threadId: 'thread-123', owner: id });

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
    it('should response 403 when wrong access', async () => {
      const server = await createServer(container);

      await UsersTableTestHelper.addUser({ id: 'user-222' });
      const { accessToken } = await AuthenticationsTableTestHelper.createToken(server);
      await ThreadsTableTestHelper.addThread({ owner: 'user-222' });
      await CommentsTableTestHelper.addComment({ threadId: 'thread-123', owner: 'user-222' });

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('anda tidak memiliki akses untuk ini');
    });
    it('should response 404 when comment not found', async () => {
      const server = await createServer(container);

      const { accessToken, id } = await AuthenticationsTableTestHelper.createToken(server);
      await ThreadsTableTestHelper.addThread({ owner: id });
      await CommentsTableTestHelper.addComment({ threadId: 'thread-123', owner: id });

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-1234',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Comment tidak ditemukan');
    });
  });
});
