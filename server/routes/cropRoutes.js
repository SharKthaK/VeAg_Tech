import express from 'express';
import * as cropController from '../controllers/cropController.js';

const router = express.Router();

// Get all crops
router.get('/', cropController.getAllCrops);

// Seed crops (development only)
router.post('/seed', cropController.seedCrops);

export default router;
