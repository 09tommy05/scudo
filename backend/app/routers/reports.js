import express from 'express';
import Report from '../models/report.js';
import { rbac } from '../middleware/rbac.js';
import mongoose from 'mongoose';
import { uploadAttachments } from '../middleware/upload.js';

const router = express.Router();

router.get('', rbac("reporter"), async (req, res) => {
    try {
        const allowedSortFields = ['created', 'status'];
        const sortField = allowedSortFields.includes(req.query.sort)
            ? req.query.sort
            : 'created';

        const direction = req.query.direction === 'asc' ? 1 : -1;

        const filter = {};

        if (req.query.status) {
            filter.status = req.query.status;
        }

        if (req.query.categoria) {
            filter.categoria = req.query.categoria;
        }

        let reports;

        if (sortField === 'status') {
            reports = await Report.aggregate([
                { $match: filter },
                {
                    $addFields: {
                        statusValue: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ['$status', 'da elaborare'] }, then: 1 },
                                    { case: { $eq: ['$status', 'in lavorazione'] }, then: 2 },
                                    { case: { $eq: ['$status', 'risolta'] }, then: 3 }
                                ],
                                default: 999
                            }
                        }
                    }
                },
                { $sort: { statusValue: direction } },
                { $project: { statusValue: 0 } }
            ]);

            reports = await Report.populate(reports, {
                path: 'author',
                select: 'name surname'
            });

        } else {
            reports = await Report.find(filter)
                .sort({ [sortField]: direction })
                .populate('author', 'name surname')
                .exec();
        }

        const serialize = (r) => ({
            self: `/api/v1/reports/${r._id}`,
            report: r
        });

        reports = reports.map(serialize);

        return res.status(200).json(reports);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});

router.post('', rbac("user"), uploadAttachments, async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Missing request body" });
        }

        let { title, text, categoria } = req.body;

        if (!title || !text || !categoria) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const attachments = req.files
            ? req.files.map(file => file.filename)
            : [];
        const report = await Report.create({
            title,
            text,
            categoria,
            attachments: attachments,
            author: req.user.id
        });

        const populated = await Report.findById(report._id)
            .populate("author", "name surname");

        return res.status(201).json({
            message: "Report created",
            self: '/api/v1/reports/' + report._id,
            report: populated
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.use('/:id', async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: "Invalid report ID" });
        return;
    }
    let report = await Report.findById(req.params.id).populate('author', 'name surname');
    if (!report) {
        res.status(404).json({
            message: "Report not found"
        });
        return;
    }
    req['report'] = report;
    next();
});

router.patch('/:id', rbac("reporter"), async (req, res) => {
    try {
        let report = req['report'];
        report.status = "in lavorazione";
        await report.save();
        report = await Report.findById(report._id).populate('author', 'name surname');
        res.status(200).json({
            self: '/api/v1/reports/' + report._id,
            report: report
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/:id', (req, res) => {
    let report = req['report'];
    try {
        if(req.user.role === 'user' && report.author._id.toString() !== req.user.id){
            return res.status(403).json({ message: "Forbidden" });
        }
        res.status(200).json(report);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;