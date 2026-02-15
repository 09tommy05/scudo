import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../app/app.js';
import Article from '../app/models/article.js';
import Operator from '../app/models/operator.js';
import bcrypt from 'bcryptjs';

const DB_URL = process.env.DB_URL ? process.env.DB_URL.replace(/\/([^\/]+)$/, '/scudo_test') : 'mongodb://127.0.0.1:27017/scudo_test';

beforeAll(async () => {
    await mongoose.connect(DB_URL);
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Articles API', () => {
    let testArticleId;
    
    beforeAll(async () => {
        // Creazione di un articolo di test come autore valido
        const hashed = await bcrypt.hash("password", 10);
        await Operator.deleteMany({});
        const author = new Operator({
            name: "Author",
            surname: "Test",
            email: "author@test.com",
            password: hashed,
            role: "editor",
            isActive: true
        });
        const savedAuthor = await author.save();

        await Article.deleteMany({});
        const article = new Article({
            title: "Test Article",
            text: "Test Content",
            short_text: "Short",
            categoria: "Test",
            author: savedAuthor._id,
            isDraft: false, //pubblicato
            img: "test.jpg"
        });
        const savedArticle = await article.save();
        testArticleId = savedArticle._id.toString();
    });

    test('ART-01 -GET /api/v1/articles - Should return 200 and an array', async () => {
        const res = await request(app).get('/api/v1/articles');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    test('ART-03 -GET /api/v1/articles/:id - Should return the article', async () => {
        const res = await request(app).get(`/api/v1/articles/${testArticleId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe("Test Article");
    });

    test('ART-04 - GET /api/v1/articles/999999999999999999999999 - Should return 404 for non-existent ID', async () => {
        const res = await request(app).get('/api/v1/articles/999999999999999999999999');
        expect(res.statusCode).toBe(404);
    });
});
