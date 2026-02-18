import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Operator from '../app/models/operator.js';
import User from '../app/models/user.js';
import bcrypt from 'bcryptjs';

dotenv.config();

async function seed() {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Connected to Database");

        const hashedAdminPassword = await bcrypt.hash(process.env.ADMIN_PSW, 10);
        const hashedUsersPassword = await bcrypt.hash("123456789", 10);

        // OPERATORI
        await Operator.deleteMany({});
        const admin = new Operator({
            name: "Admin",
            surname: "Admin",
            email: process.env.ADMIN_EMAIL,
            password: hashedAdminPassword,
            role: "admin",
            isActive: true,
            activationToken: "",
            tokenExp: Date.now()
        });
        await admin.save();
        console.log("Admin user created");

        // UTENTI
        await User.deleteMany({});
        await User.insertMany([
            {
                name: "Mario",
                surname: "Rossi",
                email: "mario.rossi@example.com",
                cf: "RSSMRA80A01H501U",
                password: hashedUsersPassword,
                allow_notifications: true
            },
            {
                name: "Luigi",
                surname: "Verdi",
                email: "luigi.verdi@example.com",
                cf: "VRDLGU85B02H501V",
                password: hashedUsersPassword,
                allow_notifications: true
            },
            {
                name: "Anna",
                surname: "Bianchi",
                email: "anna.bianchi@example.com",
                cf: "BNCHAN90C03H501W",
                password: hashedUsersPassword,
                allow_notifications: false
            }
        ]);

        console.log("Test users created");
        process.exit(0);

    } catch (err) {
        console.error("Seed error:", err);
        process.exit(1);
    }
}

seed();
