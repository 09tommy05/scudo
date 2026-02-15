import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app/app.js';
import Operator from '../app/models/operator.js';
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
        // Toglie tutti gli operatori e crea un admin di test
        await Operator.deleteMany({});
        await User.deleteMany({});
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

        const inactive = new Operator({
            name: "Inactive",
            surname: "User",
            email: "inactive@scudo.tn.it",
            password: hashedAdminPassword,
            role: "editor",
            isActive: false,
            tokenExp: Date.now()
        });
        await inactive.save();
        const spidUser = new User({
            name: "SPID",
            surname: "User",
            email: "utente@example.com",
            password: hashedAdminPassword,
            cf: "USRSPD00A01H501Z",
        });
        await spidUser.save();
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

    test('AUTH-03 - POST /auth/operator/login - Fail with disabled account', async () => {
        const res = await request(app)
            .post('/api/v1/auth/operator/login')
            .send({
                email: 'inactive@scudo.tn.it',
                password: 'testpass'
            });
        expect(res.statusCode).toBe(403);
    });
    test('AUTH-04 - POST /auth/spid/login - Success spid login', async () => {
        const res = await request(app)
            .post('/api/v1/auth/spid/login')
            .send({
                email: 'utente@example.com',
                password: 'testpass'
            });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });
    test('AUTH-02 - POST /auth/spid/login - Fail with wrong credentials', async () => {
        const res = await request(app)
            .post('/api/v1/auth/spid/login')
            .send({
                email: 'utente@example.com',
                password: 'wrongpassword'
            });
        expect(res.statusCode).toBe(401);
    });
    test("AUTH-08 - GET /auth/me/ - Operator success", async () => {
        const resLogin = await request(app)
            .post('/api/v1/auth/operator/login')
            .send({
                email: 'test@scudo.tn.it',
                password: 'testpass'
            });
        expect(resLogin.statusCode).toBe(200);
        const token = resLogin.body.token;
        const resMe = await request(app)
            .get('/api/v1/auth/me/')
            .set('x-access-token', token);
        expect(resMe.statusCode).toBe(200);
        expect(resMe.body).toHaveProperty('name', 'Test');
        expect(resMe.body).toHaveProperty('surname', 'Admin');
    });
});
