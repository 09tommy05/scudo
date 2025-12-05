import express from 'express';
import Operator from './models/operator.js';
const router = express.Router();

router.get('/operator/login', async (req, res) => {
    res.status(200).json(articles);
});
export default router;