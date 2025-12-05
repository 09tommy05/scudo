import express from 'express';
import Operator from './models/operator.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.get('', async (req, res) => {
    let operators = await Operator.find({});
    operators = operators.map( (operator) => {
        return {
            self: '/api/v1/operators/' + operator.id,
            name: operator.name
        }
    });
    res.status(200).json(operators);
});

router.post("/create", async (req, res) => {
    if(!req.body){
        res.status(400).json({message: "Missing request body"});
        return;
    }
    const { email, password, name, surname, role } = req.body;
    if(!email || !password || !name || !surname || !role){
        res.status(400).json({message: "Missing required fields"});
    }
    if(!['reporter', 'editor', 'admin'].includes(role)){
        res.status(400).json({message: "Invalid role"});
    }
    if(!email.includes("@")){
        res.status(400).json({message: "Invalid email"});
    }
    if(password.length < 6){
        res.status(400).json({message: "Password too short"});
    }
    let existingOperator = await Operator.findOne({email: email}).exec();
    if(existingOperator){
        res.status(409).json({message: "Email already in use"});
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
export default router;