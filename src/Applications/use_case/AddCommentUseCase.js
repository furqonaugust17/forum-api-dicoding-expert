const AddComment = require('../../Domains/comments/entities/AddComment');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, threadId, owner) {
    await this._threadRepository.getThreadById(threadId);

    const comment = new AddComment({
      ...useCasePayload, threadId, owner, date: new Date().toISOString(),
    });

    const addedComment = await this._commentRepository.addComment(comment);

    return new AddedComment(addedComment);
  }
}

module.exports = AddCommentUseCase;
