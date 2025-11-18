const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestratingthe add comment action correctly', async () => {
    const useCasePayload = {
      content: 'comment1',
    };

    const threadId = 'thread-123';

    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: 'user-123',
    });

    const detailThread = {
      id: 'thread-123',
      title: 'Thread 1',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ex libero, semper eget nibh sed, molestie imperdiet quam.',
      date: '2025-10-12',
      username: 'furqon',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest.fn().mockResolvedValue(detailThread);
    mockCommentRepository.addComment = jest.fn().mockImplementation(
      () => Promise.resolve({
        id: 'comment-123',
        content: useCasePayload.content,
        owner: 'user-123',
      }),
    );

    const getCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addedComment = await getCommentUseCase.execute(useCasePayload, threadId, 'user-123');

    expect(addedComment).toStrictEqual(expectedAddedComment);

    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
  });
});
