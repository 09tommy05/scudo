import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../app/app.js';
import Operator from '../app/models/operator.js';
import bcrypt from 'bcryptjs';

const DB_URL = process.env.DB_URL ?    process.env.DB_URL.replace(/\/([^\/]+)$/, '/scudo_test') : 'mongodb://127.0.0.1:27017/scudo_test';

beforeAll(async () => {
    await mongoose.connect(DB_URL);
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Auth Endpoints', () => {

    beforeAll(async () => {
        // Toglie tutti gli operatori e crea un admin di test
        await Operator.deleteMany({});
        const hashedAdminPassword = await bcrypt.hash("testpass", 10);
        const admin = new Operator({
            name: "Test",
            surname: "Admin",
            email: "test@scudo.tn.it",
            password: hashedAdminPassword,
            role: "admin",
            isActive: true,
            tokenExp: Date.now()
        });
        await admin.save();
    });

    test('AUTH-01 - POST /auth/operator/login - Success', async () => {
        const res = await request(app)
            .post('/api/v1/auth/operator/login')
            .send({
                email: 'test@scudo.tn.it',
                password: 'testpass'
            });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    test('AUTH-02 - POST /auth/operator/login - Fail with wrong credentials', async () => {
        const res = await request(app)
            .post('/api/v1/auth/operator/login')
            .send({
                email: 'test@scudo.tn.it',
                password: 'wrongpassword'
            });
        expect(res.statusCode).toBe(401);
    });
});
