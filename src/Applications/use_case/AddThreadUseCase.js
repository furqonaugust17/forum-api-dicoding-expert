const Thread = require("../../Domains/threads/entities/Thread");

class AddThreadUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository
    }

    execute(useCasePayload, owner) {
        const thread = new Thread({ ...useCasePayload, owner });
        return this._threadRepository.addThread(thread);
    }
}

module.exports = AddThreadUseCase;