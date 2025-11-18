/* eslint-disable camelcase */
const mapDBCommentToModel = ({
  id, username, date, content, is_delete,
}) => ({
  id,
  username,
  date,
  content,
  isDelete: is_delete,
});

const mapDBReplyToModel = ({
  id, username, date, content, is_delete, comment_id,
}) => ({
  id,
  username,
  date,
  content,
  isDelete: is_delete,
  commentId: comment_id,
});

module.exports = {
  mapDBCommentToModel,
  mapDBReplyToModel,
};
