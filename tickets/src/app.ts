import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { NotFoundError, errorHandler } from '@mkgittix/core';
import cookieSession from 'cookie-session';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false, // whether the cookie should be encrypted
    secure: process.env.NODE_ENV !== 'test', // only visit if we have https connection
  })
);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
