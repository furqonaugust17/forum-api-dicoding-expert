const DetailComment = require('../DetailComment');

describe('a DetailComment entities', () => {
  it('should create DetailComment object correctly when comment not deleted', () => {
    const payload = {
      id: 'comment-123',
      username: 'furqon',
      date: '2025-10-12T07:22:33.555Z',
      content: 'sebuah comment',
      replies: [],
      is_delete: null,
    };

    const comment = new DetailComment(payload);

    expect(comment.id).toEqual(payload.id);
    expect(comment.username).toEqual(payload.username);
    expect(comment.date).toEqual(payload.date);
    expect(comment.content).toEqual(payload.content);
    expect(comment.replies).toEqual(payload.replies);
  });

  it('should create DetailComment object with masked content when comment is deleted', () => {
    const payload = {
      id: 'comment-456',
      username: 'dicoding',
      date: '2025-10-13T07:26:21.338Z',
      content: 'komentar yang dihapus',
      replies: [],
      isDelete: '2021-08-08T07:30:00.000Z',
    };

    const comment = new DetailComment(payload);

    expect(comment.id).toEqual(payload.id);
    expect(comment.username).toEqual(payload.username);
    expect(comment.date).toEqual(payload.date);
    expect(comment.content).toEqual('**komentar telah dihapus**');
  });

  it('should throw error when payload not contain needed property', () => {
    const payload = {
      id: 'comment-123',
      username: 'furqon',
      date: '2025-10-12T07:22:33.555Z',
    };

    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      id: 123,
      username: true,
      date: {},
      content: [],
      replies: {},
    };

    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
