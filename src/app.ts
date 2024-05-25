import express from 'express';
import contactRouter from './routes/contact.routes';
import errorMiddleware from './middlewares/errorhandler.middleware';

const app = express();

app.use(express.json());
app.use('/', contactRouter);
app.use(errorMiddleware);

export default app;
