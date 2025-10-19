const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const Thread = require("../../../Domains/threads/entities/Thread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddThreadUseCase = require("../AddThreadUseCase");

describe('AddThreadUseCase', () => {
    it('should orchestrating the add thread action correctly', async () => {
        const useCasePayload = {
            title: 'Thread 1',
            body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ex libero, semper eget nibh sed, molestie imperdiet quam.',
        };

        const mockAddedThread = new AddedThread({
            id: 'thread-123',
            title: useCasePayload.title,
            owner: 'user-123',
        });

        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.addThread = jest.fn().mockImplementation(() => Promise.resolve(mockAddedThread));

        const getThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository
        });

        const addedThread = await getThreadUseCase.execute(useCasePayload, 'user-123');

        expect(addedThread).toStrictEqual(new AddedThread({
            id: 'thread-123',
            title: useCasePayload.title,
            owner: 'user-123',
        }));
        expect(mockThreadRepository.addThread).toHaveBeenCalledWith(new Thread({
            title: useCasePayload.title,
            body: useCasePayload.body,
            owner: 'user-123',
        }))
    })
})