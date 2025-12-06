import express from 'express';
import Operator from './models/operator.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const router = express.Router();

router.get('', async (req, res) => {
    //search for name or surname query parameters
    if (req.query) {
        if (req.query.q) {
            let query = req.query.q;
            let operators = await Operator.find({
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { surname: { $regex: query, $options: 'i' } }
                ]
            });
            operators = operators.map((operator) => {
                return {
                    self: '/api/v1/operators/' + operator.id,
                    id: operator.id,
                    name: operator.name,
                    surname: operator.surname,
                    email: operator.email,
                    role: operator.role,
                    isActive: operator.isActive
                }
            });
            res.status(200).json(operators);
            return;
        } else if (req.query.orderby) {
            let orderby = req.query.orderby;
            let order = req.query.order || 'asc';
            let sortObj = {};
            if (['name', 'surname', 'role'].includes(orderby)) {
                sortObj[orderby] = order === 'asc' ? 1 : -1;
                let operators = await Operator.find({}).sort(sortObj);
                operators = operators.map((operator) => {
                    return {
                        self: '/api/v1/operators/' + operator.id,
                        id: operator.id,
                        name: operator.name,
                        surname: operator.surname,
                        email: operator.email,
                        role: operator.role,
                        isActive: operator.isActive
                    }
                });
                res.status(200).json(operators);
                return;
            }
        }
    }
    let operators = await Operator.find({});
    operators = operators.map((operator) => {
        return {
            self: '/api/v1/operators/' + operator.id,
            id: operator.id,
            name: operator.name,
            surname: operator.surname,
            email: operator.email,
            role: operator.role,
            isActive: operator.isActive
        }
    });
    res.status(200).json(operators);
});

router.post("", async (req, res) => {
    if (!req.body) {
        res.status(400).json({ message: "Missing request body" });
        return;
    }
    const { email, password, name, surname, role } = req.body;
    if (!email || !password || !name || !surname || !role) {
        res.status(400).json({ message: "Missing required fields" });
    }
    if (!['reporter', 'editor', 'admin'].includes(role)) {
        res.status(400).json({ message: "Invalid role" });
    }
    if (!email.includes("@")) {
        res.status(400).json({ message: "Invalid email" });
    }
    if (password.length < 6) {
        res.status(400).json({ message: "Password too short" });
    }
    let existingOperator = await Operator.findOne({ email: email }).exec();
    if (existingOperator) {
        res.status(409).json({ message: "Email already in use" });
        return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let newOperator = new Operator({
        name: name,
        surname: surname,
        email: email,
        password: hashedPassword,
        role: role
    });
    await Operator.create(newOperator);
    res.status(201).json({
        message: "Operator created",
        self: '/api/v1/operators/' + newOperator._id
    });
});
router.use('/:id', async (req, res, next) => {
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
});

router.get('/:id', async (req, res) => {
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
});

router.patch('/:id', async (req, res) => {
    if (req.params.id == req.user.id) {
        res.status(400).json({ message: "Cannot update own operator status" });
        return;
    }
    //update isActive status
    let operator = req.operator;
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
});

export default router;