import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Operator from '../app/models/operator.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const hashedPassword = await bcrypt.hash(process.env.ADMIN_PSW, 10);

mongoose.connect(process.env.DB_URL)
.then ( () => {
	console.log("Connected to Database");
});

// elimina tutti gli operatori e crea l'operatore admin di default
Operator.deleteMany({}).then(()=>{
    var admin= new Operator({
        name: "Admin",
        surname: "Admin",
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin"
    });
    return admin.save();
}).then(() => {
    console.log("Admin user created");
    process.exit();
});