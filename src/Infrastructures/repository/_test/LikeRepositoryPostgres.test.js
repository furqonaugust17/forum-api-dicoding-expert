const pool = require('../../database/postgres/pool');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');

describe('LikeRepositoryPostgres', () => {

    afterEach(async () => {
        await LikesTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('verifyComment', () => {
        it('should throw error when comment not found', async () => {
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

            await expect(likeRepositoryPostgres.verifyComment('comment-x'))
                .rejects.toThrow(NotFoundError);
        });

        it('should not throw when comment exists', async () => {
            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});

            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
            await expect(likeRepositoryPostgres.verifyComment('comment-123')).resolves.not.toThrow(NotFoundError);
        });
    });

    describe('addLike', () => {
        it('should add like correctly', async () => {
            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});

            const fakeIdGenerator = () => '123';
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

            await likeRepositoryPostgres.addLike({ commentId: 'comment-123', owner: 'user-123' });

            const likes = await LikesTableTestHelper.findLike('like-123');
            expect(likes).toHaveLength(1);
        });
    });

    describe('deleteLike', () => {
        it('should delete like correctly', async () => {
            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});
            await LikesTableTestHelper.addLike({});

            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
            await likeRepositoryPostgres.deleteLike({ commentId: 'comment-123', owner: 'user-123' });

            const likes = await LikesTableTestHelper.findLike('like-123');
            expect(likes).toHaveLength(0);
        });
    });

    describe('getLikeCount', () => {
        it('should return like count correctly', async () => {
            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});

            await LikesTableTestHelper.addLike({});

            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
            const count = await likeRepositoryPostgres.getLikeCount('comment-123');

            expect(count).toBe(1);
        });
    });
});
