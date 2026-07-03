import express, { Express } from 'express';
import { userRouter } from './routers/user.router.js';
import { errorHandler } from './middleware/error-handler.js';
import { routeNotFound } from './middleware/route-not-found.js';

const app: Express = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded());

app.get('/health',(_req,res)=>{
        res.json({
            status: "ok!",
            timestamp: new Date().toISOString()
        })
})

app.use('/api/users', userRouter);

app.use(routeNotFound);
app.use(errorHandler);
export { app };