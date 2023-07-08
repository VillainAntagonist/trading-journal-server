import {Router, Response} from "express";
import {AuthenticatedRequest} from "../types/request";
import {ObjectId} from "mongodb";
import {db} from "../db";


const tradesMain = Router();

tradesMain.get('/',  async (req: AuthenticatedRequest, res: Response) => {
    try {
        // Access the user ID from the request object
        const userId = req.userId;

        // Access the strategies collection
        const trades = await db.collection('trades').find({ user: new ObjectId(userId) }).toArray();

        // Return the collection of strategies as the response
        return res.status(200).json(trades);
    } catch (error) {
        console.error('Error fetching trades', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

tradesMain.post('/',  async (req: AuthenticatedRequest, res: Response) => {
    try {
        // Access the user ID from the request object
        const userId = req.userId;

        // Extract the strategy data from the request body



        const trade = {
            user: new ObjectId(userId),

        };
        await db.collection('trades').insertOne(trade);

        return res.status(201).json({ message: 'Trade created successfully' });
    } catch (error) {
        console.error('Error creating trade', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

tradesMain.delete('/', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const tradeIds  = req.body;

        // Convert tradeIds to an array of ObjectId
        const objectIds = tradeIds.map((id:string) => new ObjectId(id));

        const result = await db.collection('trades').deleteMany({
            _id: { $in: objectIds },
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Trades not found' });
        }

        // Return a success message as the response
        return res.status(200).json({ message: 'Trades deleted successfully' });
    } catch (error) {
        console.error('Error deleting trades', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});



export default tradesMain;
