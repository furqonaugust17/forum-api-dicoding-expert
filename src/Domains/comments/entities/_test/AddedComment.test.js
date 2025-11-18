const AddedComment = require('../AddedComment');

describe('a AddedComment Entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'comment-123',
      content: 'comment1',
    };

    expect(() => new AddedComment(payload)).toThrow('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      content: [],
      owner: {},
    };

    expect(() => new AddedComment(payload)).toThrow('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create added comment object correctly', () => {
    const payload = {
      id: 'comment-123',
      content: 'comment1',
      owner: 'user-123',
    };

    const { id, content, owner } = new AddedComment(payload);
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
