class LikeUseCase {
    constructor({ likeRepository }) {
        this._likeRepository = likeRepository;
    }

    async execute({ commentId, owner }) {
        await this._likeRepository.verifyComment(commentId);

        const isLiked = await this._likeRepository.checkIsLiked({ commentId, owner });

        if (!isLiked) {
            await this._likeRepository.addLike({ commentId, owner });
        } else {
            await this._likeRepository.deleteLike({ commentId, owner });
        }
    }
}

module.exports = LikeUseCase;
