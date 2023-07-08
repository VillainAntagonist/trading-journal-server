import express from 'express';
import userRouter from "./user";
import cors from 'cors';
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import strategiesRouter from "./strategies";
import tradesRouter from "./trades";
import {closeDatabase, connectToDatabase} from "./db";
import {database, uri} from "./variables";




const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
    cors({
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE', "PATCH"],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);



app.use('/user', userRouter);
app.use(`/strategies`, strategiesRouter)
app.use(`/trades`, tradesRouter)
app.get('/', (req, res) => {
    res.send('Server is running');
});


app.listen(8080, async () => {
    await connectToDatabase(uri, database);
    console.log('Server is running on port 8080');
});

process.on('SIGINT', async () => {
    await closeDatabase();
    process.exit();
});
