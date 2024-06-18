
import { Feedback } from '../models/feedbackSchema.js';
import { catchAsyncErrors } from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../middlewares/error.js';

export const addFeedback = catchAsyncErrors(async (req, res, next) => {
  const { job, feedback } = req.body;
  const user = req.user._id;


  if (!job || !feedback) {
    return next(new ErrorHandler('All fields are required', 400));
  }

  const newFeedback = await Feedback.create({ user, job, feedback });

  res.status(201).json({
    success: true,
    message: 'Feedback added successfully',
    feedback: newFeedback,
  });
});

export const getFeedbacks = catchAsyncErrors(async (req, res, next) => {
  const { jobId } = req.params;


  if (!jobId) {
    return next(new ErrorHandler('Job ID is required', 400));
  }

  const feedbacks = await Feedback.find({ job: jobId }).populate('user', 'name');

  if (!feedbacks) {
    return next(new ErrorHandler('No feedback found for this job', 404));
  }

  res.status(200).json({
    success: true,
    feedbacks,
  });
});
