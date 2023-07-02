import {Response, Router} from "express";
import {AuthenticatedRequest} from "../types/request";
import {client, database} from "../variables";
import {Db, ObjectId} from "mongodb";

const tradesSpecified = Router();
tradesSpecified.patch('/', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.userId;
        const tradeId = req.params.id;

        const updateFields = { ...req.body };

        // Remove the _id field from the updateFields object if it exists
        delete updateFields._id;

        await client.connect();

        const db: Db = client.db(database);
        await db.collection('trades').updateOne(
            { _id: new ObjectId(tradeId), user: new ObjectId(userId) },
            { $set: updateFields }
        );

        // Return a success message as the response
        return res.status(200).json({ message: 'Trade updated successfully' });
    } catch (error) {
        console.error('Error updating trade', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

tradesSpecified.delete('/', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const tradeId = req.params.id;

        await client.connect();

        const db: Db = client.db(database);
        const result = await db.collection('trades').deleteOne({
            _id: new ObjectId(tradeId),
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Trade not found' });
        }

        // Return a success message as the response
        return res.status(200).json({ message: 'Trade deleted successfully' });
    } catch (error) {
        console.error('Error deleting trade', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});




export default tradesSpecified;
