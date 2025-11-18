const AddedReply = require('../AddedReply');

describe('a AddedReply Entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'reply-123',
      content: 'reply 1',
    };

    expect(() => new AddedReply(payload)).toThrow('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      content: [],
      owner: {},
    };

    expect(() => new AddedReply(payload)).toThrow('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create added reply object correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'reply 1',
      owner: 'user-123',
    };

    const { id, content, owner } = new AddedReply(payload);
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
