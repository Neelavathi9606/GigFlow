import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({limit: '20kb'}));
app.use(express.urlencoded({extended: true, limit: '20kb'}));
app.use(cookieParser());

app.get('/', (req, res)=>{
    res.json("Healthy Server");
})

import userRoute from './route/user.route.js'
import gigRoute from './route/gig.route.js'
import bidRoute from './route/bid.route.js'

app.use('/api/auth', userRoute);
app.use('/api/gigs', gigRoute);
app.use('/api/bids', bidRoute);

export {app}