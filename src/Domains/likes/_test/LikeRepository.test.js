const LikeRepository = require('../LikeRepository');

describe('LikeRepository Interface', () => {
    it('should throw error when invoke abstract behavior', async () => {
        const likeRepository = new LikeRepository();

        await expect(likeRepository.checkIsLiked({})).rejects.toThrow('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(likeRepository.addLike({})).rejects.toThrow('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(likeRepository.deleteLike({})).rejects.toThrow('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(likeRepository.getLikeCount({})).rejects.toThrow('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
});
