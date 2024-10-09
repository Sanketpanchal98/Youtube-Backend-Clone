import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors());

app.use(express.json({limit : '20kb'}));

app.use(express.urlencoded({extended : true , limit : '10kb'}))

app.use(express.static('public'));

app.use(cookieParser());

//adding roters
import router from './Routes/user.routes.js';

app.use('/api/v1/user' , router);


export default app;