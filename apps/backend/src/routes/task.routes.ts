import { Router } from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController';
import {
  validateTaskCreate,
  validateTaskUpdate,
  validateTaskId,
  validationErrorHandler,
} from '../middleware/taskValidators';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

router.use(isAuthenticated);

router.get('/', getAllTasks);
router.get(
  '/:id',
  validateTaskId,
  validationErrorHandler,
  getTaskById
);
router.post(
  '/',
  validateTaskCreate,
  validationErrorHandler,
  createTask
);
router.put(
  '/:id',
  validateTaskId,
  validateTaskUpdate,
  validationErrorHandler,
  updateTask
);
router.delete(
  '/:id',
  validateTaskId,
  validationErrorHandler,
  deleteTask
);

export default router;
