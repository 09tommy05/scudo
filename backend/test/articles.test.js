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

        // Login per ottenere il token
        const resLogin = await request(app)
            .post('/api/v1/auth/operator/login')
            .send({
                email: 'author@test.com',
                password: 'password'
            });
        global.editorToken = resLogin.body.token;

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
        expect([404, 400]).toContain(res.statusCode);
    });

    let newArticleId;

    test('ART-05 - POST /api/v1/articles - Should create a new article (draft)', async () => {
        const res = await request(app)
            .post('/api/v1/articles?draft=true')
            .set('x-access-token', global.editorToken)
            .field('title', 'New Article')
            .field('text', 'New Content')
            .field('short_text', 'New Short')
            .field('categoria', 'News');
        //.attach('img', 'test/test.jpg'); // Optional, removed for simplicity if file not present

        expect(res.statusCode).toBe(201);
        expect(res.body.article).toHaveProperty('title', 'New Article');
        expect(res.body.article.isDraft).toBe(true);
        newArticleId = res.body.article._id;
    });

    test('ART-07 - PUT /api/v1/articles/:id - Should update existing article', async () => {
        const res = await request(app)
            .put(`/api/v1/articles/${newArticleId}`)
            .set('x-access-token', global.editorToken)
            .field('title', 'Updated Title')
            .field('text', 'Updated Content')
            .field('short_text', 'Updated Short')
            .field('categoria', 'Updates')
            .field('isDraft', false);

        expect(res.statusCode).toBe(200);
        expect(res.body.article).toHaveProperty('title', 'Updated Title');
        expect(res.body.article.isDraft).toBe(false); // Should be false now (string 'false' sent as field might need handling, but req.body.isDraft handling depends on middleware)
    });

    test('ART-08 - DELETE /api/v1/articles/:id - Should delete article', async () => {
        const res = await request(app)
            .delete(`/api/v1/articles/${newArticleId}`)
            .set('x-access-token', global.editorToken);

        expect(res.statusCode).toBe(204);

        // Verify deletion
        const check = await request(app).get(`/api/v1/articles/${newArticleId}`);
        expect(check.statusCode).toBe(404);
    });

    test('ART-02 - GET /api/v1/articles - Should search articles', async () => {
        // Create an article to search for
        const article = new Article({
            title: "UniqueSearchTerm",
            text: "Content",
            short_text: "Short",
            categoria: "SearchCat",
            author: await Operator.findOne({ email: "author@test.com" }),
            isDraft: false,
            img: "test.jpg"
        });
        await article.save();

        const res = await request(app).get('/api/v1/articles?q=UniqueSearchTerm');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
        expect(res.body[0].title).toBe("UniqueSearchTerm");
    });

    test('ART-06 - POST /api/v1/articles - Should return 400 when missing fields', async () => {
        const res = await request(app)
            .post('/api/v1/articles')
            .set('x-access-token', global.editorToken)
            .send({
                title: "Incomplete"
            });

        expect(res.statusCode).toBe(400);
    });
});
