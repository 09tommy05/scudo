import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Operator from '../app/models/operator.js';
import bcrypt from 'bcryptjs';
import User from '../app/models/user.js';

dotenv.config();

const hashedPassword = await bcrypt.hash(process.env.ADMIN_PSW, 10);

const usersPassword = "12345678";
const hashedUsersPassword = await bcrypt.hash(usersPassword, 10);

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
        role: "admin",
        isActive: true,
        activationToken: "",
        tokenExp: Date.now()
    });
    return admin.save();
}).then(() => {
    console.log("Admin user created");
    process.exit();
}).catch((err)=>{
    console.error("Error setting up admin user:", err);
    process.exit(1);
});

//creazione degli utenti spid e cie di prova
User.deleteMany({}).then(()=>{
    var user1= new User({
        name: "Mario",
        surname: "Rossi",
        email: "mario.rossi@example.com",
        cf: "RSSMRA80A01H501U",
        password: hashedUsersPassword
    });
    var user2= new User({
        name: "Luigi",
        surname: "Verdi",
        email: "luigi.verdi@example.com",
        cf: "VRDLGU85B02H501V",
        password: hashedUsersPassword
    });
    var user3= new User({
        name: "Anna",
        surname: "Bianchi",
        email: "anna.bianchi@example.com",
        cf: "BNCHAN90C03H501W",
        password: hashedUsersPassword
    });
    return Promise.all([user1.save(), user2.save(), user3.save()]);
}).then(() => {
    console.log("Test users created");
    process.exit();
}).catch((err)=>{
    console.error("Error setting up test users:", err);
    process.exit(1);
});