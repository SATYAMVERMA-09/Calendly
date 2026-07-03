import express, { Express } from 'express';
import { userRouter } from './routers/user.router.js';
import { errorHandler } from './middleware/error-handler.js';

const app: Express = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded());

 

app.use('/api/users', userRouter);

app.use(errorHandler);
export { app };