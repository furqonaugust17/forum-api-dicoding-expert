const AddedThread = require('../../Domains/threads/entities/AddedThread');
const Thread = require('../../Domains/threads/entities/Thread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, owner) {
    const thread = new Thread({ ...useCasePayload, owner, date: new Date().toISOString() });
    const addedThread = await this._threadRepository.addThread(thread);
    return new AddedThread(addedThread);
  }
}

module.exports = AddThreadUseCase;
