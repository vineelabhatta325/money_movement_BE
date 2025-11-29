import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AuthenticationError } from '../utils/AppError';
import { asyncWrapper } from '../utils/asyncWrapper';
import { userRepository } from '../repositories/userRepository';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '1h';

export const login = asyncWrapper(async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = await userRepository.findByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        throw new AuthenticationError('Invalid credentials');
    }
    const token = jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    });

    res.json({
        success: true,
        token,
        user: {
            username: user.username,
            role: user.role
        }
    });
});
