import express from 'express';
import User from '../models/user.js';
import Report from '../models/report.js';

const router = express.Router();

router.patch('/me/notifications', async (req, res) => {
    try {
        let user = await User.findById(req.user.id).exec();
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (!req.body) {
            user.allow_notifications = !user.allow_notifications;
            await user.save();
            res.status(200).json({ self: "/api/v1/auth/me", notificationsEnabled: user.allow_notifications });
            return;
        }
        let { allow_notifications } = req.body;
        if (typeof allow_notifications !== 'boolean') {
            res.status(400).json({ message: "Invalid request body" });
            return;
        }
        user.allow_notifications = allow_notifications;
        await user.save();
        res.status(200).json({ self: "/api/v1/auth/me", notificationsEnabled: user.allow_notifications });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.get('/reports', async (req, res) => {
    try {
        const allowedSortFields = ['created', 'status'];
        const sortField = allowedSortFields.includes(req.query.sort)
            ? req.query.sort
            : 'created';

        const direction = req.query.direction === 'asc' ? 1 : -1;

        const filter = {author: req.user.id};

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

        } else {
            reports = await Report.find(filter)
                .sort({ [sortField]: direction })
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

export default router;