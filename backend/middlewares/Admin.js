import ErrorHandler from "./error.js";

export const isAdmin = (req, res, next) => {
  // Check if the user's role is 'Admin'
  if (req.user.role !== "Admin") {
    return next(new ErrorHandler("Access denied, Admin only", 403));
  }
  next();
};
