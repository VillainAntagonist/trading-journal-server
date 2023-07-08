import { Router, Request, Response } from 'express';
import {ObjectId} from 'mongodb';
import jwt, {TokenExpiredError} from 'jsonwebtoken';
import {db} from "../db";


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

            // Access the users collection
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
                return res.status(403).json({ error: 'Token has expired' });
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
