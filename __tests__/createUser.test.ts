import { createInterface } from 'readline';
import { hash } from 'bcrypt';
import { MongoClient } from 'mongodb';
import createUser from '../src/createUser';

jest.mock('readline');
jest.mock('bcrypt', () => ({
    hash: jest.fn((password: string) => Promise.resolve(`hashed:${password}`)),
}));

describe('createNewUser', () => {
    it('should create a new user', async () => {
        const mockQuestion = jest.fn();
        mockQuestion.mockImplementationOnce((question: string, callback: (answer: string) => void) => {
            callback('testUser'); // Provide a username
        });
        mockQuestion.mockImplementationOnce((question: string, callback: (answer: string) => void) => {
            callback('testPassword'); // Provide a password
        });

        (createInterface as jest.Mock).mockReturnValueOnce({
            question: mockQuestion,
            close: jest.fn(),
        });

        // Mock MongoDB connection and methods
        const mockInsertOne = jest.fn(() => Promise.resolve({ insertedId: 'fakeId' }));
        const mockCollection = jest.fn(() => ({
            insertOne: mockInsertOne,
        }));
        const mockDb = jest.fn(() => ({
            collection: mockCollection,
        }));
        const mockConnect = jest.fn(() => Promise.resolve({
            db: mockDb,
            close: jest.fn(),
        }));
        MongoClient.connect = mockConnect as any; // Override the original connect method with the mock

        await createUser();

        expect(createInterface).toHaveBeenCalledTimes(1);
        expect(mockQuestion).toHaveBeenCalledTimes(2);
        expect(hash).toHaveBeenCalledWith('testPassword', 10);
        expect(await mockConnect).toHaveBeenCalledTimes(1);
        expect(await mockConnect).toHaveBeenCalledWith('mongodb://localhost:27017');
        expect(await mockDb).toHaveBeenCalledWith('');
        expect(await mockCollection).toHaveBeenCalledWith('users');
        expect(await mockInsertOne).toHaveBeenCalledWith({
            username: 'testUser',
            password: 'hashed:testPassword',
        });
    });

    // Add more test cases if needed
});
