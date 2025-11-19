const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const Thread = require('../../../Domains/threads/entities/Thread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ username: 'furqon' });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      const thread = new Thread({
        title: 'Thread 1',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ex libero, semper eget nibh sed, molestie imperdiet quam.',
        owner: 'user-123',
        date: '2025-10-12',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await threadRepositoryPostgres.addThread(thread);

      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      const thread = new Thread({
        title: 'Thread 1',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ex libero, semper eget nibh sed, molestie imperdiet quam.',
        owner: 'user-123',
        date: '2025-10-12',

      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const addedThread = await threadRepositoryPostgres.addThread(thread);

      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'Thread 1',
        owner: 'user-123',
      }));
    });
  });

  describe('getThreadById function', () => {
    it('should return not found when thread doesnt exist', async () => {
      await ThreadsTableTestHelper.addThread({});

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);
      await expect(threadRepositoryPostgres.getThreadById('4')).rejects.toThrow(NotFoundError);
    });
    it('should return thread correctly', async () => {
      await ThreadsTableTestHelper.addThread({});
      const threadRepository = new ThreadRepositoryPostgres(pool);

      const thread = await threadRepository.getThreadById('thread-123');

      expect(thread).toStrictEqual({
        id: 'thread-123',
        title: 'Thread 1',
        body: 'Lorem ipsum dolor sit amet, consectetur',
        date: '2025-10-12',
        username: 'furqon',
      });
    });
  });
});
