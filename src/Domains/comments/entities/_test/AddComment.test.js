const AddComment = require('../AddComment');

describe('a AddThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      threadId: 'thread-1',
      owner: 'user-1',
    };

    expect(() => new AddComment(payload)).toThrow('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      threadId: [],
      owner: true,
      content: {},
      date: [{}, {}],
    };

    expect(() => new AddComment(payload)).toThrow('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create comment object correctly', () => {
    const payload = {
      threadId: 'thread-123',
      owner: 'user-123',
      content: 'comment1',
      date: '2025-10-12',
    };

    const {
      threadId, owner, content, date,
    } = new AddComment(payload);
    expect(threadId).toEqual(payload.threadId);
    expect(owner).toEqual(payload.owner);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
  });
});
