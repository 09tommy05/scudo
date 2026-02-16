import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app/app.js';
import Report from '../app/models/report.js';
import ReportAnswer from '../app/models/reportAnswer.js';
import Operator from '../app/models/operator.js';
import User from '../app/models/user.js';
import bcrypt from 'bcryptjs';

const DB_URL = process.env.DB_URL ? process.env.DB_URL.replace(/\/([^\/]+)$/, '/scudo_test') : 'mongodb://127.0.0.1:27017/scudo_test';

beforeAll(async () => {
    await mongoose.connect(DB_URL);
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Reports and Answers API', () => {
    let reporterToken;
    let userToken;
    let userId;
    let reportId;

    beforeAll(async () => {
        await Operator.deleteMany({});
        await User.deleteMany({});
        await Report.deleteMany({});
        await ReportAnswer.deleteMany({});

        // Create Reporter
        const hashedReporterPw = await bcrypt.hash("reporterpass", 10);
        const reporter = new Operator({
            name: "Reporter",
            surname: "Rep",
            email: "segnalazioni@scudo.tn.it",
            password: hashedReporterPw,
            role: "reporter",
            isActive: true
        });
        await reporter.save();

        const resReporter = await request(app)
            .post('/api/v1/auth/operator/login')
            .send({
                email: 'segnalazioni@scudo.tn.it',
                password: 'reporterpass'
            });
        reporterToken = resReporter.body.token;

        // Create User (Cittadino)
        const hashedUserPw = await bcrypt.hash("userpass", 10);
        const user = new User({
            name: "Citizen",
            surname: "Test",
            email: "citizen@test.com",
            password: hashedUserPw,
            role: "user",
            cf: "TSTSCT00A01H501Z" // Fake CF
        });
        await user.save();
        userId = user._id;

        const resUser = await request(app)
            .post('/api/v1/auth/spid/login')
            .send({
                email: 'citizen@test.com',
                password: 'userpass'
            });
        userToken = resUser.body.token;
    });

    test('REP-01 - POST /api/v1/reports - Should create a new report', async () => {
        const res = await request(app)
            .post('/api/v1/reports')
            .set('x-access-token', userToken)
            .send({
                title: "Pothole",
                text: "There is a pothole",
                categoria: "Strade"
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.report).toHaveProperty('title', 'Pothole');
        expect(res.body.report).toHaveProperty('status', 'da elaborare');
        reportId = res.body.report._id;
    });

    test('REP-02 - GET /api/v1/reports - Should list reports for Reporter', async () => {
        const res = await request(app)
            .get('/api/v1/reports')
            .set('x-access-token', reporterToken);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    test('REP-04 - PATCH /api/v1/reports/:id - Should update status to in lavorazione', async () => {
        const res = await request(app)
            .patch(`/api/v1/reports/${reportId}`)
            .set('x-access-token', reporterToken);

        expect(res.statusCode).toBe(200);
        expect(res.body.report).toHaveProperty('status', 'in lavorazione');
    });

    test('ANS-01 / REP-05 - POST /api/v1/report-answers - Should answer and close report', async () => {
        const res = await request(app)
            .post('/api/v1/report-answers')
            .set('x-access-token', reporterToken)
            .send({
                title: "Fixed",
                text: "The pothole has been fixed",
                reportID: reportId
            });

        expect(res.statusCode).toBe(201);

        // Check report status is now 'risolta'
        const check = await request(app)
            .get(`/api/v1/reports/${reportId}`)
            .set('x-access-token', reporterToken);

        expect(check.body.status).toBe('risolta');
    });
});

