const AddedReply = require('../../Domains/replies/entities/AddedReply');
const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
  }

  async execute(payload, { threadId, commentId }, owner) {
    const { content } = payload;

    await this._commentRepository.checkCommentBelongsToThread(commentId, threadId);

    const addReply = new AddReply({
      content,
      owner,
      commentId,
      date: new Date().toISOString(),
    });

    const addedReply = await this._replyRepository.addReply(addReply);

    return new AddedReply(addedReply);
  }
}

module.exports = AddReplyUseCase;
