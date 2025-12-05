import express from 'express';
import articles from './articles.js';
import cors from 'cors';
import auth from './auth.js';
import tokenChecker from './tokenChecker.js';
import operators from './operators.js';
import { rbac } from './rbac.js';

const app = express();

//parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use('/api/v1/auth', auth);
app.use('/api/v1/articles', articles);

app.use("/api/v1/operators/", tokenChecker, rbac("admin"), operators);

export default app;