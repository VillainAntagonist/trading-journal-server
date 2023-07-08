import {Response, Router} from "express";
import {AuthenticatedRequest} from "../types/request";
import {ObjectId} from "mongodb";
import {db} from "../db";

const strategiesSpecified = Router();

strategiesSpecified.patch('/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.userId;
        const strategyId = req.params.id;

        const updateFields = { ...req.body };


        // Remove the _id field from the updateFields object if it exists
        delete updateFields._id;

        await db.collection('strategies').updateOne(
            { _id: new ObjectId(strategyId), user: new ObjectId(userId) },
            { $set: updateFields }
        );

        // Return a success message as the response
        return res.status(200).json({ message: 'Strategy updated successfully' });
    } catch (error) {
        console.error('Error updating strategy', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

strategiesSpecified.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const strategyId = req.params.id;

        const result = await db.collection('strategies').deleteOne({
            _id: new ObjectId(strategyId),
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Strategy not found' });
        }

        // Return a success message as the response
        return res.status(200).json({ message: 'Strategy deleted successfully' });
    } catch (error) {
        console.error('Error deleting strategy', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});




export default strategiesSpecified;
