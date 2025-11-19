const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadDetailUseCase = require('../GetDetailThreadUseCase');

describe('GetDetailThreadUseCase', () => {
  it('should orchestrate the detail thread action correctly', async () => {
    const threadId = 'thread-123';
    const mockThread = {
      id: threadId,
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'furqon',
    };

    const mockComments = [
      {
        id: 'comment-123',
        username: 'furqon',
        date: '2025-10-12T07:22:33.555Z',
        content: 'sebuah comment',
        is_delete: null,
      },
      {
        id: 'comment-456',
        username: 'dicoding',
        date: '2025-10-13T07:26:21.338Z',
        content: 'komentar yang dihapus',
        replies: [],
        is_delete: '2021-08-08T07:30:00.000Z',
      },
    ];

    const mockReplies = [
      {
        id: 'reply-123',
        username: 'dicoding',
        date: '2025-10-12T07:22:33.555Z',
        content: 'sebuah reply',
        commentId: 'comment-123',
        is_delete: null,
      },
      {
        id: 'reply-123',
        username: 'furqon',
        date: '2025-10-12T08:00:00.000Z',
        content: 'reply 2',
        commentId: 'comment-123',
        is_delete: null,
      },
    ];

    const mockLikeCounts = {
      'comment-123': 3,
      'comment-456': 0,
    };

    const expectedDetailThread = new DetailThread({
      ...mockThread,
      comments: [
        new DetailComment({
          ...mockComments[0],
          likeCount: mockLikeCounts['comment-123'],
          replies: [
            new DetailReply(mockReplies[0]),
            new DetailReply(mockReplies[1]),
          ],
        }),
        new DetailComment({
          ...mockComments[1],
          likeCount: mockLikeCounts['comment-456'],
          replies: [],
        }),
      ],
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.getThreadById = jest.fn().mockResolvedValue(mockThread);
    mockCommentRepository.getCommentsByThreadId = jest.fn().mockResolvedValue(mockComments);
    mockReplyRepository.getRepliesByCommentIds = jest.fn().mockResolvedValue(mockReplies);
    mockLikeRepository.getLikeCount = jest.fn().mockImplementation(
      (commentId) => Promise.resolve(mockLikeCounts[commentId]),
    );

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    const threadDetail = await getThreadDetailUseCase.execute(threadId);

    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByCommentIds)
      .toHaveBeenCalledWith(['comment-123', 'comment-456']);
    expect(mockLikeRepository.getLikeCount).toHaveBeenCalledTimes(2);
    expect(mockLikeRepository.getLikeCount).toHaveBeenCalledWith('comment-123');
    expect(mockLikeRepository.getLikeCount).toHaveBeenCalledWith('comment-456');
    expect(threadDetail).toStrictEqual(expectedDetailThread);
  });
});
