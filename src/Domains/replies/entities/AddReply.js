class AddReply {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      commentId, content, owner, date,
    } = payload;
    this.commentId = commentId;
    this.content = content;
    this.owner = owner;
    this.date = date;
  }

  _verifyPayload({
    commentId, content, owner, date,
  }) {
    if (!commentId || !content || !owner || !date) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof commentId !== 'string' || typeof content !== 'string' || typeof owner !== 'string' || typeof date !== 'string') {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddReply;
