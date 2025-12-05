import express from 'express';
import Operator from './models/operator.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/operator/login', async (req, res) => {
    if(!req.body){
        res.status(400).json({message: "Missing request body"});
        return;
    }
    if(!req.body.email || !req.body.password){
        res.status(400).json({message: "Missing email or password"});
        return;
    }
    let user= await Operator.findOne({ email: req.body.email }).exec();
    if(!user){
        res.status(401).json({message: "Authentication failed. Email or password incorrect"});
        return;
    }
    //comparo la password dell'utente e quella nel db calcolando l'hash
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);

    if(!passwordMatch){
        res.status(401).json({message: "Authentication failed. Email or password incorrect"});
        return;
    }
    
    if(!user.isActive){
        res.status(403).json({message: "User inactive"});
        return;
    }
    let payload = {
        id: user._id,
        email: user.email,
        role: user.role
    };

    const ORE_EXPIRE = 12;
    let options= {expiresIn: ORE_EXPIRE*60*60};
    let token = jwt.sign(payload, process.env.JWT_SECRET, options);
    res.status(200).json({
        message: "Authentication successful",
        token: token,
        id: user._id,
        self: '/api/v1/operators/' + user._id
    });
});
export default router;