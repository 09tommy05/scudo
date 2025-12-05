import express from 'express';
import Article from './models/article.js';
const router = express.Router();

router.get('', async (req, res) => {
    let articles = await Article.find({});
    articles = articles.map( (article) => {
        return {
            self: '/api/v1/articles/' + article.id,
            title: article.title,
            img: article.img,
            short_text: article.short_text,
            categoria: article.categoria
        };
    });
    res.status(200).json(articles);
});

router.post('', async (req, res) => {
    let newArticle = new Article({ //manca author
        title: req.body.title,
        text: req.body.text,
        img: req.body.img,
        categoria: req.body.categoria,
        last_edit: req.body.last_edit,
        short_text: req.body.short_text
    });
    //faccio il poulate dell'autore
    Article.create(newArticle);
    await Article.find().populate('author').exec(); //??
    res.status(201).json(
        {
            message: "Article created",
            self: '/api/v1/articles/'+"<id>"
        });
});

router.use('/:id', async (req, res, next) => {
    let article = await Article.findById(req.params.id).populate('author').exec();
    if (!article) {
        res.status(404).json({
            message: "Article not found"
        });
        return;
    }
    req['article'] = article;
    next();
});

router.get('/:id', async (req, res) => {
    let article = req['article'];
    res.status(200).json(article);
});

router.delete('/:id', async (req, res) => {
    let article = req['article'];
    await Article.deleteOne({ _id: article._id });
    res.status(204).send();
});

export default router;