const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const { mapDBCommentToModel } = require('../database/postgres/mapper/mapToModel');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(comment) {
    const {
      threadId, content, owner, date,
    } = comment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, threadId, owner, date],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async checkExistComment({ commentId, threadId }) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND thread_id = $2',
      values: [commentId, threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Comment tidak ditemukan');
    }
  }

  async commentAccess({ commentId, owner }) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthorizationError('anda tidak memiliki akses untuk ini');
    }
  }

  async checkCommentBelongsToThread(commentId, threadId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND thread_id = $2',
      values: [commentId, threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Comment atau Thread tidak ditemukan');
    }
  }

  async deleteCommentById({ commentId, isDelete }) {
    const query = {
      text: 'UPDATE comments SET is_delete = $2 WHERE id = $1 RETURNING id',
      values: [commentId, isDelete],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Comment tidak ditemukan');
    }
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT A.id, B.username, A.content, A.date, A.is_delete 
            FROM comments A INNER JOIN users B
            ON A.owner = B.id WHERE A.thread_id = $1
            ORDER BY A.date ASC
            `,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows.map(mapDBCommentToModel);
  }
}
module.exports = CommentRepositoryPostgres;
