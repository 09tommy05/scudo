import express from 'express';
import Communication from '../models/communication.js';
import { rbac } from '../middleware/rbac.js';
import tokenChecker from '../middleware/tokenChecker.js';
import mongoose from 'mongoose';
import { sendCommunicationNotifications } from '../utils/notificationDispatcher.js';

const router = express.Router();

router.get('', async (req, res) => {
    try {
        const allowedSortFields = ['publication', 'importance'];
        const sortField = allowedSortFields.includes(req.query.sort)
            ? req.query.sort
            : 'publication';
        const direction = req.query.direction === 'asc' ? 1 : -1;

        let communications;

        if (sortField === 'importance') {

            const importanceOrder = {
                basso: 1,
                medio: 2,
                alto: 3
            };

            const orderMultiplier = direction;

            communications = await Communication.aggregate([
                { $match: { isDraft: false } },
                {
                    //aggiungo dei valori numerici per ordinare l'importanza, come voglio io
                    $addFields: {
                        importanceValue: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ['$importance', 'basso rischio'] }, then: importanceOrder.basso },
                                    { case: { $eq: ['$importance', 'medio rischio'] }, then: importanceOrder.medio },
                                    { case: { $eq: ['$importance', 'alto rischio'] }, then: importanceOrder.alto }
                                ],
                                default: 999
                            }
                        }
                    }
                },
                { $sort: { importanceValue: orderMultiplier } },
                { $project: { importanceValue: 0 } }
            ]);
        } else {
            communications = await Communication.find({ isDraft: false }).sort({ [sortField]: direction }).exec();
        }

        const serialize = (c) => ({
            self: `/api/v1/communications/${c._id}`,
            title: c.title,
            publication: c.publication,
            short_text: c.short_text,
            categoria: c.categoria,
            importance: c.importance,
            author: c.author
        });

        communications = communications.map(serialize);

        communications = await Communication.populate(communications, {
            path: 'author',
            select: 'name surname'
        });
        return res.status(200).json(communications);

    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
});

router.post('', tokenChecker, rbac("reporter"), async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Missing request body" });
        }

        let { title, text, categoria, short_text, importance } = req.body;

        let draft = req.query.draft == "true" ? true : false;
        let notify = req.query.notify == "true" ? true : false;

        if (!title || !text || !categoria || !short_text) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const communication = await Communication.create({
            title,
            text,
            importance,
            categoria,
            short_text,
            isDraft: draft,
            author: req.user.id
        });

        const populated = await Communication.findById(communication._id)
            .populate("author", "name surname");

        if (populated.isDraft === false && notify) {
            try {
                sendCommunicationNotifications(
                    communication.title,
                    communication.short_text,
                    process.env.CURRENT_HOST + '/communications/' + communication._id
                ).catch(err => console.error("[MAIL ERROR]", err));
            } catch (err) {
                console.error("[MAIL ERROR]", err);
            }
        }
        return res.status(201).json({
            message: "Communication created",
            self: '/api/v1/communications/' + communication._id,
            communication: populated
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.use('/:id', async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: "Invalid communication ID" });
        return;
    }
    let communication = await Communication.findById(req.params.id).populate('author', 'name surname');
    if (!communication) {
        res.status(404).json({
            message: "Communication not found"
        });
        return;
    }
    req['communication'] = communication;
    next();
});

//per pubblicare la comunicazione in caso sia una bozza
router.patch('/:id', tokenChecker, rbac("reporter"), async (req, res) => {
    try {
        let communication = req['communication'];
        communication.isDraft = false;
        communication.publication = Date.now();
        let notify = req.query.notify == "true" ? true : false;
        await communication.save();
        communication = await Communication.findById(communication._id).populate('author', 'name surname');
        if (notify) {
            try {
                sendCommunicationNotifications(
                    communication.title,
                    communication.short_text,
                    process.env.CURRENT_HOST + '/communications/' + communication._id
                ).catch(err => console.error("[MAIL ERROR]", err));
            } catch (err) {
                console.error("[MAIL ERROR]", err);
            }
        }

        res.status(200).json({
            message: "Communication published",
            self: '/api/v1/communications/' + communication._id,
            communication: communication
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/:id', (req, res, next) => {
    try {
        if (req.communication.isDraft) {
            next();
            return;
        }
        res.status(200).json(req.communication);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/:id', tokenChecker, rbac("reporter"), (req, res) => {
    try {
        return res.status(200).json(req.communication);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.delete('/:id', tokenChecker, rbac("reporter", "admin"), async (req, res) => {
    try {
        let communication = req['communication'];
        await Communication.deleteOne({ _id: communication._id });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put('/:id', tokenChecker, rbac("reporter"), async (req, res) => {
    try {
        let communication = req['communication'];
        if (!req.body) {
            res.status(400).json({ message: "Missing request body" });
            return;
        }
        const { title, text, categoria, short_text, isDraft, importance } = req.body;
        if (!title || !text || !categoria || !short_text || isDraft === undefined || !importance) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }

        communication.title = title;
        communication.text = text;
        communication.importance = importance;
        communication.categoria = categoria;
        communication.short_text = short_text;
        communication.isDraft = isDraft;
        communication.publication = Date.now();

        await communication.save();

        const populated = await Communication.findById(communication._id)
            .populate('author', 'name surname');

        res.status(200).json({
            message: "Communication updated",
            self: '/api/v1/communications/' + communication._id,
            communication: populated
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;