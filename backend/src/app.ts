import express, { Request, Response, NextFunction } from 'express';
import api from '@src/routes';

const app = express(); app.use(express.json());
app.use('/api', api);

export interface CustomError extends Error {
    statusCode?: number;
}

app.use((_req: Request, _res: Response, next: NextFunction) => {
    const error: CustomError = new Error('Not found');
    error.statusCode = 404;
    next(error);
});

app.use((err: CustomError, _: Request, res: Response) => {
    const statusCode = err.statusCode || 500;
    const name = err.name || 'Error';
    res
        .status(statusCode)
        .json({ name, message: err.message });
});

export default app;