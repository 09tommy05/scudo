import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app/app.js';
import Communication from '../app/models/communication.js';
import Operator from '../app/models/operator.js';
import bcrypt from 'bcryptjs';

const DB_URL = process.env.DB_URL ? process.env.DB_URL.replace(/\/([^\/]+)$/, '/scudo_test') : 'mongodb://127.0.0.1:27017/scudo_test';

beforeAll(async () => {
    await mongoose.connect(DB_URL);
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Communications API', () => {
    let reporterToken;
    let createdCommId;

    beforeAll(async () => {
        await Operator.deleteMany({});
        await Communication.deleteMany({});

        // Create Reporter
        const hashedUserPassword = await bcrypt.hash("reporterpass", 10);
        const reporter = new Operator({
            name: "Reporter",
            surname: "User",
            email: "reporter@scudo.tn.it",
            password: hashedUserPassword,
            role: "reporter",
            isActive: true
        });
        await reporter.save();

        // Login as Reporter to get token
        const resReporter = await request(app)
            .post('/api/v1/auth/operator/login')
            .send({
                email: 'reporter@scudo.tn.it',
                password: 'reporterpass'
            });
        reporterToken = resReporter.body.token;

        // Create initial public communication
        const comm = new Communication({
            title: "Public Comm",
            text: "Public Text",
            short_text: "Public Short",
            categoria: "Info",
            importance: "basso rischio",
            author: reporter._id,
            isDraft: false,
            publication: Date.now()
        });
        await comm.save();
    });

    test('COM-01 - GET /api/v1/communications - Should return list of communications', async () => {
        const res = await request(app).get('/api/v1/communications');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    test('COM-02 - POST /api/v1/communications - Should create a new communication', async () => {
        const res = await request(app)
            .post('/api/v1/communications?notify=false') // avoid email sending in test
            .set('x-access-token', reporterToken)
            .send({
                title: "New Alert",
                text: "Alert Text",
                short_text: "Alert Short",
                categoria: "Alert",
                importance: "alto rischio"
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.communication).toHaveProperty('title', 'New Alert');
        createdCommId = res.body.communication._id;
    });

    test('COM-04 - DELETE /api/v1/communications/:id - Should delete communication', async () => {
        const res = await request(app)
            .delete(`/api/v1/communications/${createdCommId}`)
            .set('x-access-token', reporterToken);

        expect(res.statusCode).toBe(204);

        // Verify deletion
        const check = await request(app).get(`/api/v1/communications/${createdCommId}`);
        expect(check.statusCode).toBe(404);
    });
});
