import express from 'express';
import Article from './models/article.js';
import { rbac } from './rbac.js';
import tokenChecker from './tokenChecker.js';
import mongoose from 'mongoose';

const router = express.Router();

router.get('', async (req, res) => {
    let articles = await Article.find({ isDraft: false }).exec();
    articles = articles.map((article) => {
        return {
            self: '/api/v1/articles/' + article.id,
            id: article.id,
            title: article.title,
            img: article.img,
            short_text: article.short_text,
            categoria: article.categoria,
            author: article.author
        };
    });
    articles = await Article.populate(articles, { path: 'author', select: 'name surname' });
    res.status(200).json(articles);
});

router.post('', tokenChecker, rbac("editor"), async (req, res) => {
    if (!req.body) {
        res.status(400).json({ message: "Missing request body" });
        return;
    }
    let { title, text, img, categoria, short_text } = req.body;

    if (!title || !text || !categoria || !short_text) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }
    const article = await Article.create({
        title,
        text,
        img: img || null,
        categoria,
        short_text,
        isDraft: false,
        author: req.user.id
    });

    const populatedArticle = await Article.findById(article._id).populate('author', 'name surname');
    res.status(201).json({
        message: "Article created",
        self: '/api/v1/articles/' + article._id,
        article: populatedArticle
    });
});

router.post('/draft', tokenChecker, rbac("editor"), async (req, res) => {
    if (!req.body) {
        res.status(400).json({ message: "Missing request body" });
        return;
    }
    let { title, text, img, categoria, short_text } = req.body;

    if (!title || !text || !categoria || !short_text) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }
    const article = await Article.create({
        title,
        text,
        img: img || null,
        categoria,
        short_text,
        author: req.user.id
    });

    const populatedArticle = await Article.findById(article._id).populate('author', 'name surname');
    res.status(201).json({
        message: "Article created",
        article: populatedArticle,
        self: '/api/v1/articles/' + article._id,
    });
});

router.put('/publish/:id', tokenChecker, rbac("editor"), async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: "Invalid article ID" });
    }
    let article = await Article.findById(req.params.id).exec();
    if (!article) {
        res.status(404).json({
            message: "Article not found"
        });
        return;
    }
    article.isDraft = false;
    await article.save();
    article = await Article.findById(article._id).populate('author', 'name surname');
    res.status(200).json({
        message: "Article published",
        self: '/api/v1/articles/' + article._id,
        article: article
    });
});

router.use('/:id', async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: "Invalid article ID" });
        return;
    }
    let article = await Article.findById(req.params.id).populate('author', 'name surname');
    if (!article) {
        res.status(404).json({
            message: "Article not found"
        });
        return;
    }
    req['article'] = article;
    next();
});

router.get('/:id', (req, res, next) => {
    if (req.article.isDraft) {
        next();
        return;
    }
    res.status(200).json(req.article);
});

router.get('/:id', tokenChecker, rbac("editor"), (req, res) => {
    if (req.article.isDraft) {
        return res.status(200).json(req.article);
    }
});

router.delete('/:id', tokenChecker, rbac("editor", "admin"), async (req, res) => {
    let article = req['article'];
    await Article.deleteOne({ _id: article._id });
    res.status(204).send();
});

router.put('/:id', tokenChecker, rbac("editor"), async (req, res) => {
    let article = req['article'];
    if(!req.body) {
        res.status(400).json({ message: "Missing request body" });
        return;
    }
    let { title, text, img, categoria, short_text, isDraft } = req.body;
    if (!title || !text || !categoria || !short_text || isDraft === undefined) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }
    article.title = title;
    article.text = text;
    article.img = img || null;
    article.isDraft = isDraft;
    article.categoria = categoria;
    article.short_text = short_text;
    article.last_edit = Date.now();
    await article.save();
    article = await Article.findById(article._id).populate('author', 'name surname');
    res.status(200).json({
        message: "Article updated",
        article: article,
        self: '/api/v1/articles/' + article._id
    });
});

export default router;