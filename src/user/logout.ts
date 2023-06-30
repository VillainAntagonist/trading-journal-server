import { Router, Request, Response } from 'express';

const logoutRouter = Router();

logoutRouter.get('/', async (req: Request, res: Response) => {
    try {
        // Clear the auth token cookie by setting an expired date
        res.cookie('authToken', '', { expires: new Date(0), httpOnly: true });

        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error during logout', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default logoutRouter;
