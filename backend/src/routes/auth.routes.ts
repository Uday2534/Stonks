import { Router } from 'express';

import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { AuthService } from '../services/auth.service';

const router = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticate, authController.me);

export default router;
