import express from 'express';
import * as caseController from '../controllers/caseController.js';

const router = express.Router();

// Create new case
router.post('/', caseController.createCase);

// Get all cases for a user
router.get('/user/:userId', caseController.getUserCases);

// Get single case by caseId
router.get('/:caseId', caseController.getCaseById);

// Process case with AI model
router.post('/:caseId/process', caseController.processCase);

// Get case result
router.get('/:caseId/result', caseController.getCaseResult);

export default router;
