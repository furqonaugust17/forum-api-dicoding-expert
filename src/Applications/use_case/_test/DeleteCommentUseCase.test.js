const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrate the delete comment action correctly', async () => {
    const params = {
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    const owner = 'user-123';

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.checkExistComment = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.commentAccess = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn().mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    await deleteCommentUseCase.execute(params, owner);
    expect(mockCommentRepository.checkExistComment).toHaveBeenCalledWith({
      commentId: params.commentId,
      threadId: params.threadId,
    });
    expect(mockCommentRepository.commentAccess).toHaveBeenCalledWith({
      owner,
      commentId: params.commentId,
    });
    expect(mockCommentRepository.deleteCommentById).toHaveBeenCalledWith({
      commentId: params.commentId,
      isDelete: expect.any(String),
    });
  });
});
