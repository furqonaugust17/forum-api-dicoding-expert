const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

const createServer = require('../createServer');
const container = require('../../container');
const pool = require('../../database/postgres/pool');

describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {

    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await LikesTableTestHelper.cleanTable();
        await RepliesTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await AuthenticationsTableTestHelper.cleanTable();
    });

    describe('PUT /threads/{threadId}/comments/{commentId}/likes', () => {
        it('should response 200 when like a comment', async () => {
            const server = await createServer(container);

            const { accessToken, id } = await AuthenticationsTableTestHelper.createToken(server);

            await ThreadsTableTestHelper.addThread({ owner: id });
            await CommentsTableTestHelper.addComment({ owner: id });

            const response = await server.inject({
                method: 'PUT',
                url: '/threads/thread-123/comments/comment-123/likes',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toBe(200);
            expect(responseJson.status).toBe('success');
        });

        it('should response 401 when no authentication', async () => {
            const server = await createServer(container);

            const response = await server.inject({
                method: 'PUT',
                url: '/threads/thread-123/comments/comment-123/likes'
            });

            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toBe(401);
            expect(responseJson.message).toBe('Missing authentication');
        });

        it('should response 404 when comment not found', async () => {
            const server = await createServer(container);

            const { accessToken } = await AuthenticationsTableTestHelper.createToken(server);

            const response = await server.inject({
                method: 'PUT',
                url: '/threads/thread-123/comments/comment-notfound/likes',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toBe(404);
            expect(responseJson.status).toBe('fail');
            expect(responseJson.message).toEqual('Comment tidak ditemukan');
        });
    });
});
