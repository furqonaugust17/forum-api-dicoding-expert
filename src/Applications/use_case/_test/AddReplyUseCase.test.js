const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const AddReplyUseCase = require('../AddReplyUseCase');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    const useCasePayload = {
      content: 'reply1',
    };

    const params = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const owner = 'user-123';

    const expectedAddedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner,
    });

    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockCommentRepository.checkCommentBelongsToThread = jest.fn().mockImplementation(
      () => Promise.resolve(),
    );
    mockReplyRepository.addReply = jest.fn().mockImplementation(
      () => Promise.resolve({
        id: 'reply-123',
        content: useCasePayload.content,
        owner,
      }),
    );

    const getReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
    });

    const addedReply = await getReplyUseCase.execute(
      useCasePayload, {
        threadId: params.threadId,
        commentId: params.commentId,
      },
      owner,
    );

    expect(addedReply).toStrictEqual(expectedAddedReply);
    expect(mockCommentRepository.checkCommentBelongsToThread)
      .toBeCalledWith(params.commentId, params.threadId);
    expect(mockReplyRepository.addReply).toBeCalled();
  });
});
