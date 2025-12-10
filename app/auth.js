import express from 'express';
import Operator from './models/operator.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import tokenChecker from './middleware/tokenChecker.js';
import { rbac } from './middleware/rbac.js';

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

router.patch('/operator/:id/set-first-password', async (req, res) => {
    try{
        if (!req.body) {
            res.status(400).json({ message: "Missing request body" });
            return;
        }
        const {newPassword}  = req.body;
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
        if(!token){
            res.status(400).json({ message: "Missing token" });
            return;
        }
        if(user.activationToken !== token){
            res.status(401).json({ message: "Invalid token" });
            return;
        }
        if(user.tokenExp < Date.now()){
            res.status(401).json({ message: "Token expired. Contact admin for more informations" });
            return;
        }

        if(newPassword.length < 8){
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

    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
export default router;