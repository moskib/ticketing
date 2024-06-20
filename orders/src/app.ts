import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { NotFoundError, currentUser, errorHandler } from '@mkgittix/core';
import cookieSession from 'cookie-session';
import { deleteOrderRouter } from './routes/delete';
import { indexOrderRouter } from './routes';
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false, // whether the cookie should be encrypted
    secure: process.env.NODE_ENV !== 'test', // only visit if we have https connection
  })
);
app.use(currentUser);
app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
