import { MongoClient, Db } from 'mongodb';

let client: MongoClient;
export let db: Db;

export const connectToDatabase = async (uri: string, dbName: string): Promise<void> => {
    client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB');

    db = client.db(dbName);
};


export const closeDatabase = async (): Promise<void> => {
    await client.close();
    console.log('Disconnected from MongoDB');
};
