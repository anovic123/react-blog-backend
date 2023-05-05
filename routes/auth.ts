import { Router, Request, Response } from 'express';
import { getMe, login, register } from '../controllers/auth';
import { checkAuth } from '../utils/checkAuth';

const router: Router = Router();

// Register
// http://localhost:4444/auth/register
router.post('/register', register);

// Login
// http://localhost:4444/auth/login
router.post('/login', login);

// Get me
// http://localhost:4444/auth/getme
router.get('/me', checkAuth, getMe);

export default router;
