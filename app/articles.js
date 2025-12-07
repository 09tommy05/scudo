import express from 'express';
import Article from './models/article.js';
import { rbac } from './middleware/rbac.js';
import tokenChecker from './middleware/tokenChecker.js';
import upload from './middleware/upload.js';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const router = express.Router();

router.get('', async (req, res) => {
    try {
        let filter = { isDraft: false };
        if (req.query?.q) {
            const query = req.query.q;
            filter.$or = [
                { title: { $regex: query, $options: 'i' } },
                { text: { $regex: query, $options: 'i' } },
                { categoria: { $regex: query, $options: 'i' } }
            ];
        }

        if (req.query?.category) {
            filter.categoria = req.query.category;
        }

        let articles = await Article.find(filter).populate('author', 'name surname').exec();

        const serialized = articles.map(a => ({
            self: `/api/v1/articles/${a.id}`,
            id: a.id,
            title: a.title,
            img: a.img,
            short_text: a.short_text,
            categoria: a.categoria,
            author: a.author
        }));

        res.status(200).json(serialized);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

/*
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
});*/

router.post('', tokenChecker, rbac("editor"), upload.single('img'), async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Missing request body" });
        }

        let { title, text, categoria, short_text } = req.body;

        if (!title || !text || !categoria || !short_text) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const img = req.file ? req.file.filename : null;

        const article = await Article.create({
            title,
            text,
            img,
            categoria,
            short_text,
            isDraft: false,
            author: req.user.id
        });

        const populated = await Article.findById(article._id)
            .populate("author", "name surname");

        return res.status(201).json({
            message: "Article created",
            self: '/api/v1/articles/' + article._id,
            article: populated
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.post('/draft', tokenChecker, rbac("editor"), upload.single('img'), async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Missing request body" });
        }

        let { title, text, categoria, short_text } = req.body;

        if (!title || !text || !categoria || !short_text) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const img = req.file ? req.file.filename : null;

        const article = await Article.create({
            title,
            text,
            img,
            categoria,
            short_text,
            author: req.user.id
        });

        const populated = await Article.findById(article._id)
            .populate("author", "name surname");

        return res.status(201).json({
            message: "Article created",
            self: '/api/v1/articles/' + article._id,
            article: populated
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
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

//per pubblicare l'articolo in caso sia una bozza
router.patch('/:id', tokenChecker, rbac("editor"), async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).json({ message: "Invalid article ID" });
        }
        let article = req['article'];
        article.isDraft = false;
        await article.save();
        article = await Article.findById(article._id).populate('author', 'name surname');
        res.status(200).json({
            message: "Article published",
            self: '/api/v1/articles/' + article._id,
            article: article
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/:id', (req, res, next) => {
    try {
        if (req.article.isDraft) {
            next();
            return;
        }
        res.status(200).json(req.article);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/:id', tokenChecker, rbac("editor"), (req, res) => {
    try {
        return res.status(200).json(req.article);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.delete('/:id', tokenChecker, rbac("editor", "admin"), async (req, res) => {
    try {
        let article = req['article'];
        // Se c'era un'immagine la elimino
        if (article.img) {
            const oldPath = path.join('uploads', 'images', article.img);
            fs.unlink(oldPath, (err) => {
                if (err) {
                    console.error("Errore eliminazione immagine:", err);
                }
            });
        }
        await Article.deleteOne({ _id: article._id });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put('/:id', tokenChecker, rbac("editor"), upload.single('img'), async (req, res) => {
    try {
        let article = req['article'];
        if (!req.body) {
            res.status(400).json({ message: "Missing request body" });
            return;
        }
        const { title, text, categoria, short_text, isDraft } = req.body;
        if (!title || !text || !categoria || !short_text || isDraft === undefined) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        if (req.file) {
            const oldImage = article.img;
            article.img = req.file.filename;
            // Se c'era una vecchia immagine la elimino
            if (oldImage) {
                const oldPath = path.join('uploads', 'images', oldImage);
                fs.unlink(oldPath, (err) => {
                    if (err) {
                        console.error("Errore eliminazione immagine:", err);
                    }
                });
            }
        }

        article.title = title;
        article.text = text;
        article.categoria = categoria;
        article.short_text = short_text;
        article.isDraft = isDraft;
        article.last_edit = Date.now();

        await article.save();

        const populated = await Article.findById(article._id)
            .populate('author', 'name surname');

        res.status(200).json({
            message: "Article updated",
            self: '/api/v1/articles/' + article._id,
            article: populated
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;