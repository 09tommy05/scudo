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

router.patch('/operator/:id/change-password', tokenChecker, rbac("editor", "reporter", "admin") ,async (req, res) => { //change password
    try{
        if (!req.body) {
            res.status(400).json({ message: "Missing request body" });
            return;
        }
        const {oldPassword, newPassword}  = req.body;
        if (!oldPassword || !newPassword) {
            res.status(400).json({ message: "Missing oldPassword or newPassword" });
            return;
        }
        
        let user = await Operator.findById(req.params.id).exec();
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if(req.user.id !== req.params.id){
            res.status(403).json({ message: "Forbidden" });
            return;
        }
        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch) {
            res.status(401).json({ message: "Authentication failed. Old password incorrect" });
            return;
        }
        if(newPassword.length < 8){
            res.status(400).json({ message: "New password must be at least 8 characters long" });
            return;
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: "Password changed successfully" });

    }catch(err){
        res.status(500).json({ message: "Internal server error" });
    }
});
export default router;