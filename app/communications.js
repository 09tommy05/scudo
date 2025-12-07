import express from 'express';
import Communication from './models/communication.js';
import { rbac } from './middleware/rbac.js';
import tokenChecker from './middleware/tokenChecker.js';
import mongoose from 'mongoose';

const router = express.Router();

router.get('', async (req, res) => {
    try {
        const allowedSortFields = ['publication', 'importance'];

        const sortField = req.query.sort || 'publication';
        const direction = req.query.direction === 'asc' ? 1 : -1;

        let query = Communication.find({ isDraft: false });

        if (allowedSortFields.includes(sortField)) {
            query = query.sort({ [sortField]: direction });
        }

        let communications = await query.exec();

        const serialize = (c) => ({
            self: `/api/v1/communications/${c.id}`,
            id: c.id,
            title: c.title,
            short_text: c.short_text,
            categoria: c.categoria,
            importance: c.importance,
            publication: c.publication,
            author: c.author
        });

        communications = communications.map(serialize);

        communications = await Communication.populate(communications, {
            path: 'author',
            select: 'name surname'
        });
        return res.status(200).json(communications);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
});

export default router;