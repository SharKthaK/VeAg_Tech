import express from 'express';
import * as caseController from '../controllers/caseController.js';

const router = express.Router();

// Create new case
router.post('/', caseController.createCase);

// Get all cases for a user
router.get('/user/:userId', caseController.getUserCases);

// Get single case by caseId
router.get('/:caseId', caseController.getCaseById);

export default router;
