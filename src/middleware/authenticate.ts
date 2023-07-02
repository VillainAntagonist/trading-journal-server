import {  Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {AuthenticatedRequest} from "../types/request";



export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Extract the authentication token from the request cookies
    const authToken = req.cookies.authToken;

    if (!authToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Verify and decode the authentication token using the secret key
        const decodedToken = jwt.verify(authToken, 'ichimoku') as { _id: string };
        // Extract the user ID from the decoded token
        const userId = decodedToken._id;
        // Add the user ID to the request object
        req.userId = userId;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
};
