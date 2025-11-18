const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrate the delete reply action correctly', async () => {
    const params = {
      replyId: 'reply-123',
      commentId: 'comment-123',
    };

    const owner = 'user-123';

    const mockReplyRepository = new ReplyRepository();

    mockReplyRepository.checkExistReply = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.replyAccess = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest.fn().mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    await deleteReplyUseCase.execute(params, owner);
    expect(mockReplyRepository.checkExistReply).toHaveBeenCalledWith({
      replyId: params.replyId,
      commentId: params.commentId,
    });
    expect(mockReplyRepository.replyAccess).toHaveBeenCalledWith({
      owner,
      replyId: params.replyId,
    });
    expect(mockReplyRepository.deleteReplyById).toHaveBeenCalledWith({
      replyId: params.replyId,
      isDelete: expect.any(String),
    });
  });
});
