class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(params, owner) {
    const { commentId, threadId } = params;
    await this._commentRepository.checkExistComment({ commentId, threadId });
    await this._commentRepository.commentAccess({ commentId, owner });
    await this._commentRepository.deleteCommentById({
      commentId,
      isDelete: new Date().toISOString(),
    });
  }
}

module.exports = DeleteCommentUseCase;
