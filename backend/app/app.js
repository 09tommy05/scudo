import express from 'express';
import cors from 'cors';
import path from 'path';

//middlewares imports
import tokenChecker from './middleware/tokenChecker.js';
import { rbac } from './middleware/rbac.js';

//routers imports
import auth from './routers/auth.js';
import articles from './routers/articles.js';
import communications from './routers/communications.js';
import operators from './routers/operators.js';
import reports from './routers/reports.js';
import users from './routers/users.js';
import reportAnswers from './routers/reportAnswers.js';

//swagger imports
import Path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import yaml from 'js-yaml';

//swagger setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);

const swaggerDocument = yaml.load(readFileSync(Path.join(__dirname, '../doc', 'oas3.yml'), 'utf8'));

const app = express();

//swagger
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
        customSiteTitle: 'SCUDO API Documentation',
    })
);

//parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());


// static files
app.use('/uploads/images', express.static(path.join(__dirname, '../uploads/images')));
app.get('/uploads/attachments/:filename', (req, res) => {
    const filePath = path.join(__dirname, '../uploads/attachments', req.params.filename);
    res.download(filePath);
});

//routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/articles', articles);
app.use('/api/v1/communications', communications);
app.use('/api/v1/reports', tokenChecker, rbac("user", "reporter"), reports);
app.use('/api/v1/user/', tokenChecker, rbac("user"), users);
app.use('/api/v1/report-answers/', tokenChecker, rbac("reporter", "user"), reportAnswers);

app.use("/api/v1/operators/", tokenChecker, rbac("admin"), operators);

app.get('/', (req, res) => {
    res.json({ message: 'working' });
});

//404 and 500 error handlers
app.use((req, res, next) => {
    res.status(404).json({ message: 'La rotta richiesta non esiste' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Errore interno del server' });
});

export default app;