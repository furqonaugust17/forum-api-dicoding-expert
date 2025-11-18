const AddReply = require('../AddReply');

describe('a AddedRepply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      commentId: 'comment-123',
      owner: 'user-123',
    };

    expect(() => new AddReply(payload)).toThrow('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      commentId: [],
      owner: true,
      content: {},
      date: [{}, {}],
    };

    expect(() => new AddReply(payload)).toThrow('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create comment object correctly', () => {
    const payload = {
      commentId: 'commet-123',
      owner: 'user-123',
      content: 'reply1',
      date: new Date().toString(),
    };

    const {
      threadId, owner, content, date,
    } = new AddReply(payload);
    expect(threadId).toEqual(payload.threadId);
    expect(owner).toEqual(payload.owner);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
  });
});
