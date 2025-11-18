const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const { mapDBReplyToModel } = require('../database/postgres/mapper/mapToModel');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(reply) {
    const {
      commentId, content, owner, date,
    } = reply;
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, commentId, owner, date],
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async getRepliesByCommentIds(commentIds) {
    if (!commentIds.length) return [];

    const query = {
      text: `
        SELECT A.id, A.content, B.username, A.date, A.comment_id , A.is_delete
        FROM replies A INNER JOIN users B
        ON A.owner = B.id
        WHERE comment_id = ANY($1::text[])
        ORDER BY A.date ASC
      `,
      values: [commentIds],
    };

    const result = await this._pool.query(query);
    return result.rows.map(mapDBReplyToModel);
  }

  async checkExistReply({ replyId, commentId }) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1 AND comment_id = $2',
      values: [replyId, commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Reply tidak ditemukan');
    }
  }

  async replyAccess({ replyId, owner }) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Reply tidak ditemukan');
    }
    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError('anda tidak memiliki akses untuk ini');
    }
  }

  async deleteReplyById({ replyId, isDelete }) {
    const query = {
      text: 'UPDATE replies SET is_delete = $1 WHERE id = $2',
      values: [isDelete, replyId],
    };
    await this._pool.query(query);
  }
}

module.exports = ReplyRepositoryPostgres;
