const CommentsTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      const addComment = new AddComment({
        threadId: 'thread-123',
        content: 'ipsum dolor sit amet, consectetur adipiscing elit. Aenean ex libero, semper eget nibh sed, molestie imperdiet quam.',
        owner: 'user-123',
        date: '2025-10-12',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');

      expect(comments).toHaveLength(1);
      expect(addedComment).toEqual(new AddedComment({
        id: 'comment-123',
        content: addComment.content,
        owner: addComment.owner,
      }));
    });

    it('should return added comment correctly', async () => {
      const addComment = new AddComment({
        threadId: 'thread-123',
        content: 'ipsum dolor sit amet, consectetur adipiscing elit. Aenean ex libero, semper eget nibh sed, molestie imperdiet quam.',
        owner: 'user-123',
        date: '2025-10-12',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'ipsum dolor sit amet, consectetur adipiscing elit. Aenean ex libero, semper eget nibh sed, molestie imperdiet quam.',
        owner: 'user-123',
      }));
    });
  });

  describe('checkExistComment function', () => {
    it('should throw NotFoundError when comment exist', async () => {
      const commentRepository = new CommentRepositoryPostgres(pool);

      await CommentsTableTestHelper.addComment({});

      await expect(commentRepository.checkExistComment({ commentId: 'comment-1235', threadId: 'thread-123' })).rejects.toThrowError(NotFoundError);
    });
    it('should not throw NotFoundError when comment exist', async () => {
      const commentRepository = new CommentRepositoryPostgres(pool);

      await CommentsTableTestHelper.addComment({});

      await expect(commentRepository.checkExistComment({ commentId: 'comment-123', threadId: 'thread-123' })).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('commentAccess function', () => {
    it('should throw AuthorizationError when access comment accepted', async () => {
      const commentRepository = new CommentRepositoryPostgres(pool);
      await CommentsTableTestHelper.addComment({});
      await expect(commentRepository.commentAccess({ commentId: 'comment-123', owner: '123-1234' })).rejects.toThrowError(AuthorizationError);
    });
    it('should not throw AuthorizationError when access comment accepted', async () => {
      const commentRepository = new CommentRepositoryPostgres(pool);
      await CommentsTableTestHelper.addComment({});
      await expect(commentRepository.commentAccess({ commentId: 'comment-123', owner: 'user-123' })).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteCommentById function', () => {
    it('should throw NotFoundError when comment doesnt exist', async () => {
      const commentRepository = new CommentRepositoryPostgres(pool);
      await CommentsTableTestHelper.addComment({});
      await expect(commentRepository.deleteCommentById({ commentId: 'comment-1234', isDelete: new Date().toISOString() })).rejects.toThrowError(NotFoundError);
    });

    it('should delete comment by id', async () => {
      const deleteDate = new Date().toISOString();
      const commentRepository = new CommentRepositoryPostgres(pool);
      await CommentsTableTestHelper.addComment({});
      await commentRepository.deleteCommentById({ commentId: 'comment-123', isDelete: deleteDate });
      const comments = await commentRepository.getCommentsByThreadId('thread-123');
      expect(comments[0]).toStrictEqual({
        id: 'comment-123',
        content: 'Lorem ipsum dolor sit amet, consectetur',
        username: 'dicoding',
        date: '2025-10-12',
        isDelete: deleteDate,
      });
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return list of comments correctly', async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        content: 'komentar 1',
        owner: 'user-123',
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-124',
        threadId: 'thread-123',
        content: 'komentar 2',
        owner: 'user-123',
        date: '2025-10-13',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);

      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');
      expect(comments).toHaveLength(2);

      expect(comments[0]).toStrictEqual({
        id: 'comment-123',
        content: 'komentar 1',
        username: 'dicoding',
        date: '2025-10-12',
        isDelete: null,
      });

      expect(comments[1]).toStrictEqual({
        id: 'comment-124',
        content: 'komentar 2',
        username: 'dicoding',
        date: '2025-10-13',
        isDelete: null,
      });
    });
  });

  describe('checkCommentBelongsToThread', () => {
    it('should throw NotFoundError if comment not found in that thread', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);

      await expect(commentRepositoryPostgres.checkCommentBelongsToThread('comment-1233', 'thread-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError if comment belongs to thread', async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);

      await expect(commentRepositoryPostgres.checkCommentBelongsToThread('comment-123', 'thread-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });
});
