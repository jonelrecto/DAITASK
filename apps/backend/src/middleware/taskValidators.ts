import {
  body,
  param,
  validationResult,
  type ValidationChain,
} from 'express-validator';
import type { Request, Response, NextFunction } from 'express';

const statusValues = ['Pending', 'In Progress', 'Completed'];
const priorityValues = ['Low', 'Medium', 'High'];

export const validateTaskCreate: ValidationChain[] = [
  body('title').trim().notEmpty().isLength({ max: 255 }).withMessage('Title required (max 255 chars)'),
  body('description').optional().trim(),
  body('status').optional().isIn(statusValues).withMessage('Invalid status'),
  body('priority').optional().isIn(priorityValues).withMessage('Invalid priority'),
  body('dueDate').optional().isISO8601().toDate().withMessage('Invalid date'),
];

export const validateTaskUpdate: ValidationChain[] = [
  body('title').optional().trim().isLength({ max: 255 }),
  body('description').optional().trim(),
  body('status').optional().isIn(statusValues),
  body('priority').optional().isIn(priorityValues),
  body('dueDate').optional().isISO8601().toDate(),
  body().custom((value, { req }) => {
    const { title, description, status, priority, dueDate } = req.body;
    if (
      title === undefined &&
      description === undefined &&
      status === undefined &&
      priority === undefined &&
      dueDate === undefined
    ) {
      throw new Error('At least one field must be provided');
    }
    return true;
  }),
];

export const validateTaskId = param('id').isInt({ min: 1 }).withMessage('Valid task ID required');

export function validationErrorHandler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      message: 'Validation failed',
      errors: errors.array(),
    });
    return;
  }
  next();
}
