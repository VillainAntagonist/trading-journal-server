import {Request, Response, Router} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { MongoClient, Db } from 'mongodb';
require("dotenv").config();


const loginRouter = Router();

loginRouter.post('/', async (req: Request, res: Response) => {

    try {
        // Get the username and password from the request body
        const { username, password } = req.body;

        // Connect to the MongoDB database
        const uri = process.env.DB_URI || 'mongodb://localhost:27017';
        const database = process.env.DB_NAME || "";
        const client = new MongoClient(uri);

        await client.connect();
        console.log('Connected to MongoDB');

        // Access the users collection
        const db: Db = client.db(database);
        const collection = db.collection('users');

        // Find the user by username
        const user = await collection.findOne({ username });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate an authentication token
        const token = jwt.sign({ userId: user._id }, 'ichimoku', { expiresIn: '7d' });

        // Set the token as an HTTP-only cookie
        res.cookie('authToken', token, { httpOnly: true });

        await client.close();
        console.log('Disconnected from MongoDB');

        return res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error during login', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default loginRouter;
