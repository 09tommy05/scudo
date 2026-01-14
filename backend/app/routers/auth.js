import express from 'express';
import Operator from '../models/operator.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import tokenChecker from '../middleware/tokenChecker.js';

const router = express.Router();

router.post('/operator/login', async (req, res) => {
    try {

        if (!req.body) {
            res.status(400).json({ message: "Missing request body" });
            return;
        }
        if (!req.body.email || !req.body.password) {
            res.status(400).json({ message: "Missing email or password" });
            return;
        }
        let user = await Operator.findOne({ email: req.body.email }).exec();
        if (!user) {
            res.status(401).json({ message: "Authentication failed. Email or password incorrect" });
            return;
        }
        //comparo la password dell'utente e quella nel db calcolando l'hash
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);

        if (!passwordMatch) {
            res.status(401).json({ message: "Authentication failed. Email or password incorrect" });
            return;
        }

        if (!user.isActive) {
            res.status(403).json({ message: "User inactive" });
            return;
        }
        let payload = {
            id: user._id,
            email: user.email,
            role: user.role
        };

        const ORE_EXPIRE = 12;
        let options = { expiresIn: ORE_EXPIRE * 60 * 60 };
        let token = jwt.sign(payload, process.env.JWT_SECRET, options);
        res.status(200).json({
            message: "Authentication successful",
            token: token,
            id: user._id,
            isActive: user.isActive,
            self: '/api/v1/operators/' + user._id
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.patch('/operator/:id', async (req, res) => {
    try {
        if (!req.body) {
            res.status(400).json({ message: "Missing request body" });
            return;
        }
        const { newPassword } = req.body;
        if (!newPassword) {
            res.status(400).json({ message: "Missing newPassword" });
            return;
        }

        let user = await Operator.findById(req.params.id).exec();
        let token = req.query.token;
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (!token) {
            res.status(400).json({ message: "Missing token" });
            return;
        }
        if (user.activationToken !== token) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }
        if (user.tokenExp < Date.now()) {
            res.status(401).json({ message: "Token expired. Contact admin for more informations" });
            return;
        }

        if (newPassword.length < 8) {
            res.status(400).json({ message: "New password must be at least 8 characters long" });
            return;
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.activationToken = null;
        user.tokenExp = null;
        user.isActive = true;
        await user.save();
        res.status(200).json({ message: "Password changed successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post(['/spid/login', '/cie/login'], async (req, res) => {
    try {
        if (!req.body) {
            res.status(400).json({ message: "Missing request body" });
            return;
        }
        if (!req.body.email || !req.body.password) {
            res.status(400).json({ message: "Missing email or password" });
            return;
        }
        let user = await User.findOne({ email: req.body.email }).exec();
        if (!user) {
            res.status(401).json({ message: "Authentication failed. Email or password incorrect" });
            return;
        }
        //comparo la password dell'utente e quella nel db calcolando l'hash
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);

        if (!passwordMatch) {
            res.status(401).json({ message: "Authentication failed. Email or password incorrect" });
            return;
        }
        let payload = {
            id: user._id,
            email: user.email,
            role: "user"
        };
        const ORE_EXPIRE = 12;
        let options = { expiresIn: ORE_EXPIRE * 60 * 60 };
        let token = jwt.sign(payload, process.env.JWT_SECRET, options);
        res.status(200).json({
            message: "Authentication successful",
            self: '/api/v1/auth/me/',
            token: token,
            id: user._id,
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/me/", tokenChecker, async (req, res) => {
    if (req.user.role === "user") {
        try {
            let user = await User.findById(req.user.id).select("-password").exec();
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            res.status(200).json({
                id: user._id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                cf: user.cf,
                allow_notifications: user.allow_notifications,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
            return;
        }
    } else {
        try {
            let operator = await Operator.findById(req.user.id).select("-password").exec();
            if (!operator) {
                res.status(404).json({ message: "Operator not found" });
                return;
            }
            res.status(200).json({
                self: '/api/v1/operators/' + operator._id,
                id: operator._id,
                name: operator.name,
                surname: operator.surname,
                email: operator.email,
                role: operator.role,
                isActive: operator.isActive
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
            return;
        }
    }
});

export default router;