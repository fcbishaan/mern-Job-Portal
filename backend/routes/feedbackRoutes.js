// routes/feedbackRoutes.js
import express from 'express';
import { addFeedback, getFeedbacks } from '../controllers/feedbackController.js';
import { isAuthenticated } from '../middlewares/Auth.js';

const router = express.Router();

router.post('/add', isAuthenticated, addFeedback);
router.get('/job/:jobId', getFeedbacks);

export default router;
