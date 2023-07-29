import {Response, Router} from "express";
import {AuthenticatedRequest} from "../types/request";
import {ObjectId} from "mongodb";
import {db} from "../db";

const tradesSpecified = Router();

tradesSpecified.patch('/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.userId;
        const tradeId = req.params.id;

        const updateFields = { ...req.body };

        // Remove the _id field from the updateFields object if it exists
        delete updateFields._id;

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

tradesSpecified.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = new ObjectId(req.userId);
        const tradeId = req.params.id;

        const updateFields = { ...req.body, user: userId };
        // Calculate the 'pips' field based on the type, enter, and exit fields
        if (updateFields.enter  && updateFields.exit  && updateFields.type) {
            updateFields.pips =
                updateFields.type === 'Short'
                    ? updateFields.enter - updateFields.exit
                    : updateFields.exit - updateFields.enter;
        } else {
            // If any of the required values is missing, set the 'pips' field to null
            updateFields.pips = null;
        }

        // Remove the _id field from the updateFields object if it exists
        delete updateFields._id;

        await db.collection('trades').replaceOne(
            { _id: new ObjectId(tradeId), user: userId },
            updateFields
        );

        // Return a success message as the response
        return res.status(200).json({ message: 'Trade updated successfully' });
    } catch (error) {
        console.error('Error updating trade', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


tradesSpecified.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const tradeId = req.params.id;

        const result = await db.collection('trades').deleteOne({
            _id: new ObjectId(tradeId),
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Trade not found' });
        }

        return res.status(200).json({ message: 'Trade deleted successfully' });
    } catch (error) {
        console.error('Error deleting trade', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});




export default tradesSpecified;
