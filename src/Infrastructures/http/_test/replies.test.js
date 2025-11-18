const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted reply', async () => {
      const requestPayload = {
        content: 'reply1',
      };

      const server = await createServer(container);

      const { accessToken, id } = await AuthenticationsTableTestHelper.createToken(server);
      await ThreadsTableTestHelper.addThread({ owner: id });
      await CommentsTableTestHelper.addComment({ threadId: 'thread-123', owner: id });

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });

    it('should response 401 when request does not contain authentication', async () => {
      const requestPayload = {
        content: 'reply1',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const requestPayload = {};

      const server = await createServer(container);

      const { accessToken, id } = await AuthenticationsTableTestHelper.createToken(server);
      await ThreadsTableTestHelper.addThread({ owner: id });
      await CommentsTableTestHelper.addComment({ threadId: 'thread-123', owner: id });

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat balasan komentar karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      const requestPayload = {
        content: 123,
      };

      const server = await createServer(container);

      const { accessToken, id } = await AuthenticationsTableTestHelper.createToken(server);
      await ThreadsTableTestHelper.addThread({ owner: id });
      await CommentsTableTestHelper.addComment({ threadId: 'thread-123', owner: id });

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat balasan komentar karena tipe data tidak sesuai');
    });

    it('should response 404 when thread not found', async () => {
      const requestPayload = {
        content: 'reply1',
      };

      const server = await createServer(container);

      const { accessToken } = await AuthenticationsTableTestHelper.createToken(server);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-notfound/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Comment atau Thread tidak ditemukan');
    });

    it('should response 404 when comment not found', async () => {
      const requestPayload = {
        content: 'reply1',
      };

      const server = await createServer(container);

      const { accessToken, id } = await AuthenticationsTableTestHelper.createToken(server);
      await ThreadsTableTestHelper.addThread({ owner: id });

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-notfound/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Comment atau Thread tidak ditemukan');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 when delete reply', async () => {
      const server = await createServer(container);

      const { accessToken, id } = await AuthenticationsTableTestHelper.createToken(server);
      await ThreadsTableTestHelper.addThread({ owner: id });
      await CommentsTableTestHelper.addComment({ threadId: 'thread-123', owner: id });
      await RepliesTableTestHelper.addReply({ commentId: 'comment-123', owner: id });

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 401 when request does not contain authentication', async () => {
      const server = await createServer(container);
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 403 when access not match', async () => {
      const server = await createServer(container);

      await UsersTableTestHelper.addUser({ id: 'user-aaa' });
      const { accessToken } = await AuthenticationsTableTestHelper.createToken(server);

      await ThreadsTableTestHelper.addThread({ owner: 'user-aaa' });
      await CommentsTableTestHelper.addComment({ threadId: 'thread-123', owner: 'user-aaa' });
      await RepliesTableTestHelper.addReply({ commentId: 'comment-123', owner: 'user-aaa' });

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('anda tidak memiliki akses untuk ini');
    });

    it('should response 404 when reply not found', async () => {
      const server = await createServer(container);

      const { accessToken, id } = await AuthenticationsTableTestHelper.createToken(server);
      await ThreadsTableTestHelper.addThread({ owner: id });
      await CommentsTableTestHelper.addComment({ threadId: 'thread-123', owner: id });

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-xxx',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Reply tidak ditemukan');
    });
  });
});
