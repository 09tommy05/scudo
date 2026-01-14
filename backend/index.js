import app from './app/app.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3010;

app.locals.db = mongoose.connect(process.env.DB_URL).then(() => {
    
    console.log("Connected to db");

    app.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`);
    });
});