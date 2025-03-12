import express from 'express';
import History from '../models/History.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
    try {
        const history = await History.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(history);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;