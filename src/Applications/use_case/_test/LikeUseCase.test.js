const LikeRepository = require('../../../Domains/likes/LikeRepository');
const LikeUseCase = require('../LikeUseCase');

describe('LikeUseCase', () => {
    it('should like comment when user has not liked before', async () => {
        const payload = {
            commentId: 'comment-123',
            owner: 'user-123',
        };

        const mockLikeRepository = new LikeRepository();

        mockLikeRepository.verifyComment = jest.fn().mockResolvedValue();
        mockLikeRepository.checkIsLiked = jest.fn().mockResolvedValue(false);
        mockLikeRepository.addLike = jest.fn().mockResolvedValue();
        mockLikeRepository.deleteLike = jest.fn().mockResolvedValue();

        const likeUseCase = new LikeUseCase({
            likeRepository: mockLikeRepository,
        });

        await likeUseCase.execute(payload);

        expect(mockLikeRepository.verifyComment)
            .toHaveBeenCalledWith('comment-123');
        expect(mockLikeRepository.checkIsLiked)
            .toHaveBeenCalledWith({ commentId: 'comment-123', owner: 'user-123' });
        expect(mockLikeRepository.addLike)
            .toHaveBeenCalledWith({ commentId: 'comment-123', owner: 'user-123' });
        expect(mockLikeRepository.deleteLike)
            .not.toHaveBeenCalled();
    });


    it('should unlike comment when user already liked it', async () => {
        const payload = {
            commentId: 'comment-123',
            owner: 'user-123',
        };

        const mockLikeRepository = new LikeRepository();

        mockLikeRepository.verifyComment = jest.fn().mockResolvedValue();
        mockLikeRepository.checkIsLiked = jest.fn().mockResolvedValue(true);
        mockLikeRepository.addLike = jest.fn();
        mockLikeRepository.deleteLike = jest.fn().mockResolvedValue();

        const likeUseCase = new LikeUseCase({
            likeRepository: mockLikeRepository,
        });

        await likeUseCase.execute(payload);

        expect(mockLikeRepository.verifyComment).toHaveBeenCalledWith('comment-123');
        expect(mockLikeRepository.checkIsLiked)
            .toHaveBeenCalledWith({ commentId: 'comment-123', owner: 'user-123' });
        expect(mockLikeRepository.deleteLike)
            .toHaveBeenCalledWith({ commentId: 'comment-123', owner: 'user-123' });
        expect(mockLikeRepository.addLike).not.toHaveBeenCalled();
    });
});
