const DetailComment = require('../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../Domains/replies/entities/DetailReply');
const DetailThread = require('../../Domains/threads/entities/DetailThread');

class GetThreadDetailUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    const commentIds = comments.map((comment) => comment.id);
    const replies = await this._replyRepository.getRepliesByCommentIds(commentIds);

    const likeCounts = Object.fromEntries(
      (await Promise.all(
        commentIds.map((id) => this._likeRepository.getLikeCount(id)),
      )).map((count, index) => [commentIds[index], count]),
    );

    const repliesGroup = {};
    replies.forEach((reply) => {
      if (!repliesGroup[reply.commentId]) {
        repliesGroup[reply.commentId] = [];
      }
      repliesGroup[reply.commentId].push(new DetailReply(reply));
    });

    const commentDetails = comments.map((comment) => new DetailComment({
      ...comment,
      likeCount: likeCounts[comment.id],
      replies: repliesGroup[comment.id] || [],
    }));

    return new DetailThread({
      ...thread,
      comments: commentDetails,
    });
  }
}

module.exports = GetThreadDetailUseCase;
