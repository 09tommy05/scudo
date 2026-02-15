import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app/app.js';
import Report from '../app/models/report.js';
import bcrypt from 'bcryptjs';
import User from '../app/models/user.js';

const DB_URL = process.env.DB_URL ? process.env.DB_URL.replace(/\/([^\/]+)$/, '/scudo_test') : 'mongodb://127.0.0.1:27017/scudo_test';

beforeAll(async () => {
    await mongoose.connect(DB_URL);
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Auth Endpoints', () => {

    beforeAll(async () => {
        await User.deleteMany({});
        await Report.deleteMany({});
        const hashed = await bcrypt.hash("testpass", 10);
        const user = new User({
            name: "Test2",
            surname: "User2",
            email: "test_user@example.com",
            password: hashed,
            cf: "TSTUSR00A01H501Z"
        });
        await user.save();
        const report = new Report({
            title: "Test Report",
            text: "This is a test report",
            categoria: "Phishing",
            author: user._id
        });
        await report.save();
    });

    test('USR-01 - GET /user/reports - Success', async () => {
        const res = await request(app)
            .post('/api/v1/auth/spid/login')
            .send({
                email: 'test_user@example.com',
                password: 'testpass'
            });
        expect(res.statusCode).toBe(200);
        const token = res.body.token;
        const resReports = await request(app)
            .get('/api/v1/user/reports')
            .set('x-access-token', token);
        expect(resReports.statusCode).toBe(200);
        expect(Array.isArray(resReports.body)).toBe(true);
        expect(resReports.body.length).toBeGreaterThan(0);
        expect(resReports.body[0]).toHaveProperty('report');
    });
    test('USR-02 - PATCH /user/me/notifications - Success', async () => {
        const resAuth = await request(app)
            .post('/api/v1/auth/spid/login')
            .send({
                email: 'test_user@example.com',
                password: 'testpass'
            });
        expect(resAuth.statusCode).toBe(200);
        const token = resAuth.body.token;
        const resNotifications = await request(app)
            .patch('/api/v1/user/me/notifications')
            .set('x-access-token', token);
        expect(resNotifications.statusCode).toBe(200);
        expect(resNotifications.body).toHaveProperty('notificationsEnabled');
    });
});
