import express from 'express';
import apiRouter from './routes/index';
import errorMiddleware from './middlewares/errorhandler.middleware';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swaggerConfig';

const app = express();

app.use(express.json());
app.use('/api', apiRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(errorMiddleware);

export default app;
