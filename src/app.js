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
import videorouter from './Routes/video.routes.js'
import { cookieFetcher } from './Middlewares/AuthUser.js';
import playListRouter from './Routes/playlist.routes.js'
import commentRouter from './Routes/comment.routes.js';
import tweetRouter from './Routes/tweet.routes.js'



app.use('/api/v1/user' , router);

//adding cookie fetcher for global routes
app.use(cookieFetcher);

app.use('/api/v1/video' , videorouter);

app.use('/api/v1/playList' , playListRouter);

app.use('/api/v1/comment' , commentRouter);

app.use('/api/v1/tweet' , tweetRouter);


export default app;