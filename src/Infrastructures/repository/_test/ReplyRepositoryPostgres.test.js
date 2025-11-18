const CommentsTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist add reply and return added reply correctly', async () => {
      const addReply = new AddReply({
        commentId: 'comment-123',
        content: 'ipsum dolor sit amet, consectetur adipiscing elit. Aenean ex libero, semper eget nibh sed, molestie imperdiet quam.',
        owner: 'user-123',
        date: new Date().toString(),
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await replyRepositoryPostgres.addReply(addReply);

      const replies = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(replies).toHaveLength(1);
    });

    it('should return added reply correctly', async () => {
      const addReply = new AddReply({
        commentId: 'comment-123',
        content: 'ipsum dolor sit amet, consectetur adipiscing elit. Aenean ex libero, semper eget nibh sed, molestie imperdiet quam.',
        owner: 'user-123',
        date: new Date().toString(),
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const addedReply = await replyRepositoryPostgres.addReply(addReply);

      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: 'ipsum dolor sit amet, consectetur adipiscing elit. Aenean ex libero, semper eget nibh sed, molestie imperdiet quam.',
        owner: 'user-123',
      }));
    });
  });

  describe('getRepliesByCommentIds function', () => {
    it('should return replies by comment ids ordered ASC', async () => {
      await RepliesTableTestHelper.addReply({});

      await RepliesTableTestHelper.addReply({
        id: 'reply-124',
        commentId: 'comment-123',
        owner: 'user-123',
        date: '2025-10-14T07:22:33.556Z',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const result = await replyRepositoryPostgres.getRepliesByCommentIds(['comment-123']);

      expect(result).toHaveLength(2);
      expect(result[0]).toStrictEqual({
        id: 'reply-123',
        content: 'Lorem ipsum dolor sit amet, consectetur',
        username: 'dicoding',
        date: '2025-10-13T07:22:33.556Z',
        commentId: 'comment-123',
        isDelete: null,
      });

      expect(result[1]).toStrictEqual({
        id: 'reply-124',
        content: 'Lorem ipsum dolor sit amet, consectetur',
        username: 'dicoding',
        date: '2025-10-14T07:22:33.556Z',
        commentId: 'comment-123',
        isDelete: null,
      });
    });

    it('should return empty array when commentIds is empty', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const result = await replyRepositoryPostgres.getRepliesByCommentIds([]);

      expect(result).toEqual([]);
    });
  });

  describe('checkExistReply function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepository.checkExistReply(
        { replyId: 'reply-123', commentId: 'comment-123' },
      )).rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when reply exist', async () => {
      await RepliesTableTestHelper.addReply({});

      const replyRepository = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepository.checkExistReply({ replyId: 'reply-123', commentId: 'comment-123' }))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('replyAccess function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      const replyRepository = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepository.replyAccess({ replyId: 'reply-123', owner: 'user-123' }))
        .rejects.toThrow(NotFoundError);
    });

    it('should throw AuthorizationError when owner not match', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-124', username: 'furqon' });
      await RepliesTableTestHelper.addReply({ owner: 'user-123' });

      const replyRepository = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepository.replyAccess({ replyId: 'reply-123', owner: 'user-124' }))
        .rejects.toThrow(AuthorizationError);
    });

    it('should not throw AuthorizationError when owner match', async () => {
      await RepliesTableTestHelper.addReply({ owner: 'user-123' });

      const replyRepository = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepository.replyAccess({ replyId: 'reply-123', owner: 'user-123' }))
        .resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteReplyById function', () => {
    it('should set delete flag correctly', async () => {
      await RepliesTableTestHelper.addReply({});

      const replyRepository = new ReplyRepositoryPostgres(pool, {});
      const fakeDeleteDate = '2025-10-15T00:00:00.000Z';

      await replyRepository.deleteReplyById({ replyId: 'reply-123', isDelete: fakeDeleteDate });

      const reply = await RepliesTableTestHelper.findReplyById('reply-123');

      expect(reply[0].is_delete).toEqual(fakeDeleteDate);
    });
  });
});
