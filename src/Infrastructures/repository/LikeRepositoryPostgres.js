const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async verifyComment(commentId) {
        const result = await this._pool.query({
            text: 'SELECT id FROM comments WHERE id = $1',
            values: [commentId],
        });

        if (!result.rowCount) {
            throw new NotFoundError('Comment tidak ditemukan');
        }
    }

    async checkIsLiked({ commentId, owner }) {
        const result = await this._pool.query({
            text: 'SELECT id FROM likes WHERE comment_id = $1 AND owner = $2',
            values: [commentId, owner],
        });

        return result.rowCount > 0;
    }

    async addLike({ commentId, owner }) {
        const id = `like-${this._idGenerator()}`;

        await this._pool.query({
            text: 'INSERT INTO likes VALUES($1, $2, $3)',
            values: [id, commentId, owner],
        });
    }

    async deleteLike({ commentId, owner }) {
        await this._pool.query({
            text: 'DELETE FROM likes WHERE comment_id = $1 AND owner = $2',
            values: [commentId, owner],
        });
    }

    async getLikeCount(commentId) {
        const result = await this._pool.query({
            text: 'SELECT COUNT(*) AS likeCount FROM likes WHERE comment_id = $1',
            values: [commentId],
        });

        return Number(result.rows[0].likecount);
    }
}

module.exports = LikeRepositoryPostgres;
