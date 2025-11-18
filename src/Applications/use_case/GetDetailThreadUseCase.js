const DetailComment = require('../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../Domains/replies/entities/DetailReply');
const DetailThread = require('../../Domains/threads/entities/DetailThread');

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    const commentIds = comments.map((comment) => comment.id);
    const replies = await this._replyRepository.getRepliesByCommentIds(commentIds);

    const repliesGroup = {};
    replies.forEach((reply) => {
      if (!repliesGroup[reply.commentId]) {
        repliesGroup[reply.commentId] = [];
      }
      repliesGroup[reply.commentId].push(new DetailReply(reply));
    });

    const commentDetails = comments.map((comment) => new DetailComment({
      ...comment,
      replies: repliesGroup[comment.id] || [],
    }));

    return new DetailThread({
      ...thread,
      comments: commentDetails,
    });
  }
}

module.exports = GetThreadDetailUseCase;
