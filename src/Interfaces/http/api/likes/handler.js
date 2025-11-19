const autoBind = require('auto-bind');
const LikeUseCase = require('../../../../Applications/use_case/LikeUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async putLikeHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;

    const likeUseCase = this._container.getInstance(LikeUseCase.name);

    await likeUseCase.execute({ threadId, commentId, owner });

    return h.response({
      status: 'success',
    });
  }
}

module.exports = LikesHandler;
