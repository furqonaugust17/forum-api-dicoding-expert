const AddedThread = require("../AddedThread");

describe('a AddedThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            id: 'thread-123',
            title: 'Thread 1',
        };

        expect(() => new AddedThread(payload)).toThrow('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 123,
            title: 'Thread 1',
            owner: [{}]
        };

        expect(() => new AddedThread(payload)).toThrow('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create AddedThread object correctly', () => {
        const payload = {
            id: 'thread-123',
            title: 'Thread 1',
            owner: 'user-123'
        };

        const addedThread = new AddedThread(payload);

        expect(addedThread.id).toEqual(payload.id);
        expect(addedThread.title).toEqual(payload.title);
        expect(addedThread.owner).toEqual(payload.owner);
    })
});