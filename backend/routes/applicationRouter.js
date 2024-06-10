import express from "express";
import {
  employerGetAllApplications,
  jobseekerDeleteApplication,
  jobseekerGetAllApplications,
  postApplication,
  acceptApplication,
  declineApplication,
  PendingApplication,
  
} from "../controllers/applicationController.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/Auth.js";

const router = express.Router();

router.post("/post", isAuthenticated, postApplication);
router.get("/employer/getall", isAuthenticated, employerGetAllApplications);
router.get("/jobseeker/getall", isAuthenticated, jobseekerGetAllApplications);
router.delete("/delete/:id", isAuthenticated, jobseekerDeleteApplication);
router.put('/accept/:id', isAuthenticated, authorizeRoles('Employer'), acceptApplication);
router.put('/decline/:id', isAuthenticated, authorizeRoles('Employer'), declineApplication);
router.put('/pending/:id',isAuthenticated,authorizeRoles('Employer'),PendingApplication);

export default router;
