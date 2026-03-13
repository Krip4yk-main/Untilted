import { type NextFunction, type Request, type Response } from 'express';
import { authService } from './auth.service.js';

export const authGuard = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Unauthorized: Bearer token is missing' });
        return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Unauthorized: Token is missing' });
        return;
    }

    try {
        const isValid = await authService.verify(token);
        if (isValid) {
            next();
        } else {
            res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
    } catch {
        res.status(401).json({ message: 'Unauthorized: Token verification failed' });
    }
};
