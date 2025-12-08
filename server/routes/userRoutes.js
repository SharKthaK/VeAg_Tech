import express from 'express';
import { body } from 'express-validator';
import {
  authenticateUser,
  getUserById,
  getUserByEmail,
  updateUserProfile,
  getNameHistory
} from '../controllers/userController.js';

const router = express.Router();

// Authenticate or create user (POST /api/users/auth)
router.post('/auth', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('firebaseUid').notEmpty().withMessage('Firebase UID is required')
], authenticateUser);

// Get user by userId (GET /api/users/:userId)
router.get('/:userId', getUserById);

// Get user by email (GET /api/users/email/:email)
router.get('/email/:email', getUserByEmail);

// Update user profile (PUT /api/users/:userId)
router.put('/:userId', [
  body('name').optional().notEmpty().withMessage('Name cannot be empty')
], updateUserProfile);

// Get name history (GET /api/users/:userId/name-history)
router.get('/:userId/name-history', getNameHistory);

export default router;
