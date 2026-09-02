import { Router } from 'express';

import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { AuthService } from '../services/auth.service';

const router = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

router.get('/me', authenticate, authController.me);

export default router;
