import {Router, Response} from "express";
import {AuthenticatedRequest} from "../types/request";
import {ObjectId} from "mongodb";
import {db} from "../db";


const strategiesMain = Router();


strategiesMain.get('/',  async (req: AuthenticatedRequest, res: Response) => {
    try {
        // Access the user ID from the request object
        const userId = req.userId;

        // Access the strategies collection
        const strategies = await db.collection('strategies').find({ user: new ObjectId(userId) }).toArray();

        // Return the collection of strategies as the response
        return res.status(200).json(strategies);
    } catch (error) {
        console.error('Error fetching strategies', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

strategiesMain.post('/',  async (req: AuthenticatedRequest, res: Response) => {
    try {
        // Access the user ID from the request object
        const userId = req.userId;

        // Extract the strategy data from the request body


        const strategy = {
            user: new ObjectId(userId)
        };

        // Insert the strategy document into the strategies collection
        await db.collection('strategies').insertOne(strategy);

        // Return a success message as the response
        return res.status(201).json({ message: 'Strategy created successfully' });
    } catch (error) {
        console.error('Error creating strategy', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

strategiesMain.delete('/', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const  strategyIds  = req.body;

        // Convert strategyIds to an array of ObjectId
        const objectIds = strategyIds.map((id: string) => new ObjectId(id));

        const result = await db.collection('strategies').deleteMany({
            _id: { $in: objectIds },
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Strategies not found' });
        }

        // Return a success message as the response
        return res.status(200).json({ message: 'Strategies deleted successfully' });
    } catch (error) {
        console.error('Error deleting strategies', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default strategiesMain;
