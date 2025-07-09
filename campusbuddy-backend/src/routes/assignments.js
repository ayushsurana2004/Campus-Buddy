const { body, validationResult } = require('express-validator');

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/User');
const {
  createAssignment,
  getAssignments,
  updateAssignment,
  deleteAssignment
} = require('../controllers/assignmentController');

// All routes below are protected by JWT middleware
router.use(authMiddleware);

// Create a new assignment
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('dueDate').isISO8601().withMessage('Due date must be a valid date')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  createAssignment
);

// Get all assignments for the logged-in user
router.get('/', getAssignments);

// Update an assignment by ID
router.put(
  '/:id',
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('dueDate').optional().isISO8601().withMessage('Due date must be a valid date')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  updateAssignment
);

// Delete an assignment by ID
router.delete('/:id', deleteAssignment);



module.exports = router;