import express from 'express';
import Operator from '../models/operator.js';
import mongoose from 'mongoose';
import mailer from '../utils/mailer.js';
import crypto from 'crypto';

const router = express.Router();

router.get('', async (req, res) => {
    try {
        //search for name or surname query parameters
        const { q, sort, direction = 'asc' } = req.query || {};

        const serialize = (operator) => ({
            self: '/api/v1/operators/' + operator.id,
            id: operator.id,
            name: operator.name,
            surname: operator.surname,
            email: operator.email,
            role: operator.role,
            isActive: operator.isActive
        });

        if (q) {
            let operators = await Operator.find({
                $or: [
                    { name: { $regex: q, $options: 'i' } },
                    { surname: { $regex: q, $options: 'i' } }
                ]
            });

            return res.status(200).json(operators.map(serialize));
        }

        if (sort && ['name', 'surname', 'role'].includes(sort)) {
            const sortObj = { [sort]: direction === 'asc' ? 1 : -1 };
            let operators = await Operator.find({}).sort(sortObj);

            return res.status(200).json(operators.map(serialize));
        }

        let operators = await Operator.find({});
        return res.status(200).json(operators.map(serialize));
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});


router.post("", async (req, res) => {
    try {
        if (!req.body) {
            res.status(400).json({ message: "Missing request body" });
            return;
        }
        const { email, name, surname, role } = req.body;
        if (!email || !name || !surname || !role) {
            res.status(400).json({ message: "Missing required fields" });
        }
        if (!['reporter', 'editor', 'admin'].includes(role)) {
            res.status(400).json({ message: "Invalid role" });
        }
        if (!email.includes("@")) {
            res.status(400).json({ message: "Invalid email" });
        }
        let existingOperator = await Operator.findOne({ email: email }).exec();
        if (existingOperator) {
            res.status(409).json({ message: "Email already in use" });
            return;
        }
        const activationToken = crypto.randomBytes(32).toString('hex');
        let newOperator = new Operator({
            name: name,
            surname: surname,
            email: email,
            password: " ",
            isActive: false,
            role: role,
            activationToken: activationToken,
            tokenExp: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });
        await Operator.create(newOperator);
        try {
            await mailer.sendPasswordSetupEmail(
                email,
                name + " " + surname,
                `${process.env.CURRENT_HOST}/set-first-password/?token=${activationToken}&id=${newOperator._id}` //TODO CHECK IT WITH FRONTEND
            );
        } catch (error) {
            await Operator.findByIdAndDelete(newOperator._id).exec();
            console.error("[MAIL ERROR] Invio email di impostazione password fallito:", error);
            res.status(500).json({ message: "Failed to send setup email" });
            return;
        }
        res.status(201).json({
            message: "Operator created",
            self: '/api/v1/operators/' + newOperator._id
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});
router.use('/:id', async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).json({ message: "Invalid operator ID" });
            return;
        }
        let operator = await Operator.findById(req.params.id).exec();
        if (!operator) {
            res.status(404).json({ message: "Operator not found" });
            return;
        }
        req.operator = operator;
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        let operator = req.operator;
        res.status(200).json({
            self: '/api/v1/operators/' + operator.id,
            id: operator.id,
            name: operator.name,
            surname: operator.surname,
            email: operator.email,
            role: operator.role,
            isActive: operator.isActive
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        if (req.params.id == req.user.id) {
            res.status(400).json({ message: "Cannot update own operator status" });
            return;
        }
        //update isActive status
        let operator = req.operator;
        if(operator.activationToken != null){
            res.status(400).json({ message: "Cannot change isActive status of an operator who has not set their password yet" });
            return;
        }        
        if (!req.body || !('isActive' in req.body) || typeof req.body.isActive !== 'boolean') {
            operator.isActive = !operator.isActive;
        } else {
            operator.isActive = req.body.isActive;
        }
        await operator.save();
        res.status(200).json({
            message: "Operator updated",
            self: '/api/v1/operators/' + operator.id,
            isActive: operator.isActive
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});

export default router;