const DetailReply = require('../DetailReply');

describe('a DetailReply entities', () => {
  it('should create DetailReply object correctly when reply not deleted', () => {
    const payload = {
      id: 'reply-123',
      username: 'furqon',
      date: '2025-10-12T07:22:33.555Z',
      content: 'sebuah reply',
      is_delete: null,
    };

    const reply = new DetailReply(payload);

    expect(reply.id).toEqual(payload.id);
    expect(reply.username).toEqual(payload.username);
    expect(reply.date).toEqual(payload.date);
    expect(reply.content).toEqual(payload.content);
  });

  it('should create DetailReply object with masked content when reply is deleted', () => {
    const payload = {
      id: 'reply-456',
      username: 'dicoding',
      date: '2025-10-13T07:26:21.338Z',
      content: 'komentar yang dihapus',
      isDelete: '2021-08-08T07:30:00.000Z',
    };

    const reply = new DetailReply(payload);

    expect(reply.id).toEqual(payload.id);
    expect(reply.username).toEqual(payload.username);
    expect(reply.date).toEqual(payload.date);
    expect(reply.content).toEqual('**balasan telah dihapus**');
  });

  it('should throw error when payload not contain needed property', () => {
    const payload = {
      id: 'reply-123',
      username: 'furqon',
      date: '2025-10-12T07:22:33.555Z',
    };

    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      id: 123,
      username: true,
      date: {},
      content: [],
    };

    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
