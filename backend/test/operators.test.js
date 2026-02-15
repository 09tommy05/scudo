import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app/app.js';
import Operator from '../app/models/operator.js';
import bcrypt from 'bcryptjs';
import { jest } from '@jest/globals';

const DB_URL = process.env.DB_URL ? process.env.DB_URL.replace(/\/([^\/]+)$/, '/scudo_test') : 'mongodb://127.0.0.1:27017/scudo_test';

// Mock del modulo mailer per evitare invio email reali durante i test
jest.unstable_mockModule('../app/utils/mailer.js', () => ({
    sendPasswordSetupEmail: jest.fn().mockResolvedValue(true)
}));

beforeAll(async () => {
    await mongoose.connect(DB_URL);
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Operators API', () => {
    let adminToken;
    let userToken;

    beforeAll(async () => {
        await Operator.deleteMany({});

        // Create Admin
        const hashedAdminPassword = await bcrypt.hash("adminpass", 10);
        const admin = new Operator({
            name: "Admin",
            surname: "User",
            email: "admin@scudo.tn.it",
            password: hashedAdminPassword,
            role: "admin",
            isActive: true
        });
        await admin.save();

        // Login as Admin to get token
        const resAdmin = await request(app)
            .post('/api/v1/auth/operator/login')
            .send({
                email: 'admin@scudo.tn.it',
                password: 'adminpass'
            });
        adminToken = resAdmin.body.token;

        // Create Regular User (Reporter)
        const hashedUserPassword = await bcrypt.hash("userpass", 10);
        const user = new Operator({
            name: "Regular",
            surname: "User",
            email: "user@scudo.tn.it",
            password: hashedUserPassword,
            role: "reporter",
            isActive: true
        });
        await user.save();

        // Login as User to get token
        const resUser = await request(app)
            .post('/api/v1/auth/operator/login')
            .send({
                email: 'user@scudo.tn.it',
                password: 'userpass'
            });
        userToken = resUser.body.token;
    });

    test('OP-01 - GET /api/v1/operators - Should return list of operators for Admin', async () => {
        const res = await request(app)
            .get('/api/v1/operators')
            .set('x-access-token', adminToken);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThanOrEqual(2);
    });

    test('OP-02 - POST /api/v1/operators - Should create a new operator', async () => {
        const res = await request(app)
            .post('/api/v1/operators')
            .set('x-access-token', adminToken)
            .send({
                name: "New",
                surname: "Operator",
                email: "newop@scudo.tn.it",
                password: "password123",
                role: "editor"
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'Operator created');
        expect(res.body).toHaveProperty('self');
    });

    test('OP-03 - POST /api/v1/operators - Should fail if email already exists', async () => {
        const res = await request(app)
            .post('/api/v1/operators')
            .set('x-access-token', adminToken)
            .send({
                name: "Duplicate",
                surname: "User",
                email: "admin@scudo.tn.it", // Existing email
                password: "password123",
                role: "editor"
            });

        expect(res.statusCode).toBe(409);
    });

    test('OP-04 - GET /api/v1/operators - Should forbid access for non-admin', async () => {
        const res = await request(app)
            .get('/api/v1/operators')
            .set('x-access-token', userToken);

        expect(res.statusCode).toBe(403);
    });

    test('OP-05 - POST /api/v1/operators - Should forbid creation for non-admin', async () => {
        const res = await request(app)
            .post('/api/v1/operators')
            .set('x-access-token', userToken)
            .send({
                name: "Hacker",
                surname: "User",
                email: "hacker@scudo.tn.it",
                password: "password123",
                role: "admin"
            });

        expect(res.statusCode).toBe(403);
    });
});