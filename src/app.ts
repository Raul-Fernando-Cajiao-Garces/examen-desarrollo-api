import express from 'express';
import { errorHandler, notFoundHandler } from './shared/httpErrorHandlers';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', name: 'examen-desarrollo-api' });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
