const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const LikeUseCase = require('../LikeUseCase');

describe('LikeUseCase', () => {
  it('should like comment when user has not liked before', async () => {
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.getThreadById = jest.fn().mockResolvedValue();
    mockCommentRepository.checkExistComment = jest.fn().mockResolvedValue();
    mockLikeRepository.checkIsLiked = jest.fn().mockResolvedValue(false);
    mockLikeRepository.addLike = jest.fn().mockResolvedValue();
    mockLikeRepository.deleteLike = jest.fn().mockResolvedValue();

    const likeUseCase = new LikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    await likeUseCase.execute(payload);

    expect(mockThreadRepository.getThreadById)
      .toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.checkExistComment)
      .toHaveBeenCalledWith({ commentId: 'comment-123', threadId: 'thread-123' });
    expect(mockLikeRepository.checkIsLiked)
      .toHaveBeenCalledWith({ commentId: 'comment-123', owner: 'user-123' });
    expect(mockLikeRepository.addLike)
      .toHaveBeenCalledWith({ commentId: 'comment-123', owner: 'user-123' });
    expect(mockLikeRepository.deleteLike)
      .not.toHaveBeenCalled();
  });

  it('should unlike comment when user already liked it', async () => {
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.getThreadById = jest.fn().mockResolvedValue();
    mockCommentRepository.checkExistComment = jest.fn().mockResolvedValue();
    mockLikeRepository.checkIsLiked = jest.fn().mockResolvedValue(true);
    mockLikeRepository.addLike = jest.fn();
    mockLikeRepository.deleteLike = jest.fn().mockResolvedValue();

    const likeUseCase = new LikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    await likeUseCase.execute(payload);

    expect(mockThreadRepository.getThreadById)
      .toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.checkExistComment)
      .toHaveBeenCalledWith({ commentId: 'comment-123', threadId: 'thread-123' });
    expect(mockLikeRepository.checkIsLiked)
      .toHaveBeenCalledWith({ commentId: 'comment-123', owner: 'user-123' });
    expect(mockLikeRepository.deleteLike)
      .toHaveBeenCalledWith({ commentId: 'comment-123', owner: 'user-123' });
    expect(mockLikeRepository.addLike).not.toHaveBeenCalled();
  });
});
