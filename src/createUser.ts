import { MongoClient } from 'mongodb';
import readline from 'readline';
import bcrypt from 'bcrypt';
require("dotenv").config();



const uri = process.env.DB_URI || 'mongodb://localhost:27017';
const database = process.env.DB_NAME || "";
async function createNewUser() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question('Enter username: ', async (username) => {
            rl.question('Enter password: ', async (password) => {
                const hashedPassword = await bcrypt.hash(password, 10);

                const user = {
                    username,
                    password: hashedPassword
                };

                const db = client.db(database);
                const result = await db.collection('users').insertOne(user);
                console.log(`User created with ID: ${result.insertedId}`);

                rl.close();
                await client.close();
                console.log('Disconnected from MongoDB');
            });
        });
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
    }
}

createNewUser();

export default createNewUser;
