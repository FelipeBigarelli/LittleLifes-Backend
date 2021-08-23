import 'reflect-metadata';

import express from 'express';
import cors from 'cors';

import './database/connection';

import authRoute from './routes/auth.routes';
import postRoute from './routes/post.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use(authRoute);
app.use(postRoute);

app.listen(5000, () => {
  console.log('Server started on port 5000');
});
