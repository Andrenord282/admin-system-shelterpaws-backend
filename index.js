const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const configCros = require('./config/configCros');
const cookieParser = require('cookie-parser');
const authRouter = require('./routers/authRouter');
const errorMiddleware = require('./middlewares/errorMiddleware');
require('dotenv').config();

const app = express();
app.use(cors(configCros));
app.use(cookieParser());
app.use(express.json());
app.use('/auth', authRouter);
app.use(errorMiddleware);

const run = async () => {
    try {
        const PORT = process.env.PORT || 4000;
        const DB_HOST = process.env.DB_HOST;

        const mongooseSet = {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        };

        mongoose.set('strictQuery', false);
        mongoose.connect(DB_HOST, mongooseSet);

        app.listen(PORT, (err) => {
            if (err) {
                console.log(err);
            }
            console.log(`Слушатель работает, порт: ${PORT}`);
        });
    } catch (error) {
        console.error('Ошибка:', error);
    }
};

run();
