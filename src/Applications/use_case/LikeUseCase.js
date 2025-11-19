class LikeUseCase {
    constructor({ threadRepository, commentRepository, likeRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._likeRepository = likeRepository;
    }

    async execute({ threadId, commentId, owner }) {
        await this._threadRepository.getThreadById(threadId);
        await this._commentRepository.checkExistComment({ commentId, threadId });

        const isLiked = await this._likeRepository.checkIsLiked({ commentId, owner });

        if (!isLiked) {
            await this._likeRepository.addLike({ commentId, owner });
        } else {
            await this._likeRepository.deleteLike({ commentId, owner });
        }
    }
}

module.exports = LikeUseCase;
