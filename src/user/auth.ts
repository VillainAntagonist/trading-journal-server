import { Router, Request, Response } from 'express';
import {MongoClient, Db, ObjectId} from 'mongodb';
import jwt, {TokenExpiredError} from 'jsonwebtoken';
require("dotenv").config();


const authRouter = Router();

authRouter.get('/', async (req: Request, res: Response) => {
    try {
        // Get the auth token from the request cookies
        const authToken = req.cookies.authToken;

        if (!authToken) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            // Verify and decode the auth token
            const decodedToken = jwt.verify(authToken, 'ichimoku') as { userId: string };
            const userId = new ObjectId(decodedToken.userId);

            // Connect to the MongoDB database
            const uri = process.env.DB_URI || 'mongodb://localhost:27017';
            const database = process.env.DB_NAME || '';
            const client = new MongoClient(uri);

            await client.connect();
            console.log('Connected to MongoDB');

            // Access the users collection
            const db: Db = client.db(database);
            const collection = db.collection('users');

            // Find the user by ID
            const user = await collection.findOne({ _id: userId });

            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // User is authenticated, return the username
            return res.status(200).json({ username: user.username });
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                // Token has expired
                return res.status(401).json({ error: 'Token has expired' });
            } else {
                // Token verification failed for other reasons
                return res.status(401).json({ error: 'Invalid token' });
            }
        }
    } catch (error) {
        console.error('Error during authentication', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default authRouter;
