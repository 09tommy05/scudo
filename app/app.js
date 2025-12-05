import express from 'express';
import articles from './articles.js';
import cors from 'cors';
import auth from './auth.js';

const app = express();

//parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use('/api/v1', auth);
app.use('/api/v1/articles', articles);

export default app;