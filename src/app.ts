import express from 'express';
import userRouter from "./user";
import cors from 'cors';
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';




const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
    cors({
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true, // Allow requests with credentials
    })
);


// Other middleware and configuration

// Use the user routes under the '/users' route
app.use('/user', userRouter);
app.get('/', (req, res) => {
    res.send('Server is running'); // Return a simple response indicating the server is running
});


// Start the server
app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
