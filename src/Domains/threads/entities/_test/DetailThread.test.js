const DetailThread = require('../DetailThread');

describe('a DetailThread entities', () => {
  it('should create DetailThread object correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2025-10-12T07:22:33.555Z',
      username: 'furqon',
      comments: [
        {
          id: 'comment-123',
          username: 'dicoding',
          date: '2025-10-12T07:22:33.555Z',
          content: 'sebuah comment',
        },
      ],
    };

    const thread = new DetailThread(payload);

    expect(thread.id).toEqual(payload.id);
    expect(thread.title).toEqual(payload.title);
    expect(thread.body).toEqual(payload.body);
    expect(thread.date).toEqual(payload.date);
    expect(thread.username).toEqual(payload.username);
    expect(thread.comments).toEqual(payload.comments);
  });

  it('should throw error when payload not contain needed property', () => {
    const payload = {
      id: 'thread-123',
      title: 'Thread 1',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ex libero, semper eget nibh sed, molestie imperdiet quam.',
      date: '2025-10-12T07:22:33.555Z',
      comments: [],
    };

    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      id: 123,
      title: true,
      body: [],
      date: {},
      username: 321,
      comments: 'bukan array',
    };

    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
