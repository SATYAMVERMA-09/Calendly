import express, { Express } from 'express';
import { userRouter } from './routers/user.router.js';

const app: Express = express();

app.use(express.json());

app.get('/health', (_req,res)=>{
        res.json({
            status: "ok!",
            timestamp: new Date().toISOString()
        })
})

app.use('/api/users', userRouter);

export { app };