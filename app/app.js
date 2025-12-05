import express from 'express';
import articles from './articles.js';
import cors from 'cors';
import auth from './auth.js';
import tokenChecker from './tokenChecker.js';
import operators from './operators.js';
import { rbac } from './rbac.js';

//swagger imports
import Path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import yaml from 'js-yaml';

//swagger setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);

const swaggerDocument = yaml.load(readFileSync(Path.join(__dirname, '..', 'oas3.yml'), 'utf8'));

const app = express();

//swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use('/api/v1/auth', auth);
app.use('/api/v1/articles', articles);

app.use("/api/v1/operators/", tokenChecker, rbac("admin"), operators);

export default app;