class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(params, owner) {
    const { replyId, commentId } = params;
    await this._replyRepository.checkExistReply({ replyId, commentId });
    await this._replyRepository.replyAccess({ replyId, owner });
    await this._replyRepository.deleteReplyById({
      replyId,
      isDelete: new Date().toISOString(),
    });
  }
}

module.exports = DeleteReplyUseCase;
