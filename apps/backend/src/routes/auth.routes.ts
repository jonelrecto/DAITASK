import { Router } from 'express';
import {
  register,
  login,
  logout,
  getCurrentUser,
} from '../controllers/authController';
import {
  registerValidation,
  loginValidation,
  validationErrorHandler,
} from '../middleware/validators';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

router.post(
  '/register',
  registerValidation,
  validationErrorHandler,
  register
);
router.post('/login', loginValidation, validationErrorHandler, login);
router.post('/logout', isAuthenticated, logout);
router.get('/me', isAuthenticated, getCurrentUser);

export default router;
