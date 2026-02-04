import { Router } from 'express';
import { getDashboardStats } from '../controllers/analyticsController';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

router.get('/dashboard', isAuthenticated, getDashboardStats);

export default router;
