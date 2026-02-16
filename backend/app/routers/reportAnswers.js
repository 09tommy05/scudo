import express from 'express';
import { rbac } from '../middleware/rbac.js';
import mongoose from 'mongoose';
import ReportAnswer from '../models/reportAnswer.js';
import Report from '../models/report.js';
import mailer from '../utils/mailer.js';

const router = express.Router();

router.post('', rbac("reporter"), async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Missing request body" });
        }

        let { title, text, reportID } = req.body;

        if (!title || !text || !reportID) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        if (!mongoose.Types.ObjectId.isValid(reportID)) {
            return res.status(400).json({ message: "Invalid report ID" });
        }
        let existingReportAnswer = await ReportAnswer.findOne({ report: reportID });
        if (existingReportAnswer) {
            return res.status(409).json({ message: "A report answer for this report already exists" });
        }
        let existingReport = await Report.findById(reportID);
        if (!existingReport) {
            return res.status(404).json({ message: "Report not found" });
        }
        existingReport.status = "risolta";
        await existingReport.save();
        const answer = await ReportAnswer.create({
            title,
            text,
            author: req.user.id,
            report: reportID
        });
        
        const populated = await ReportAnswer.findById(answer._id)
            .populate("author", "name surname");
        //send user notification (TODO)
        await existingReport.populate(
            'author',
            'email name surname allow_notifications'
        );

        const user = existingReport.author;

        if (user?.allow_notifications) {
            const fullName = `${user.name} ${user.surname}`;
            try {
                await mailer.sendUserNotificationReport(
                    user.email,
                    `SCUDO - La tua segnalazione intitolata "${existingReport.title}" è stata risolta.`,
                    fullName,
                    existingReport.title,
                    `https://${process.env.CURRENT_HOST}/reports/${existingReport._id}`
                );
            } catch (error) {
                console.error("[MAIL ERROR] Invio notifica utente fallito:", error);
            }
        }

        return res.status(201).json({
            self: '/api/v1/report-answers/' + answer._id,
            reportAnswer: populated
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: "Invalid report answer ID" });
        return;
    }
    let answer = await ReportAnswer.findOne({ report: req.params.id }).populate("author", "name surname");
    if (!answer) {
        res.status(404).json({
            message: "Report answer not found"
        });
        return;
    }
    let report = await Report.findById(answer.report);
    try {
        if (req.user.role === 'user' && report.author._id.toString() !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }
        res.status(200).json(answer);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;