import { Router } from "express";
import {
  createMeeting,
  deleteMeeting,
  getLoggedINUserMeetings,
  getMeeting,
  getMeetings,
  getUserMeetings,
  updateMeeting,
} from "./meeting.controller";
import { authorizeRoles } from "../../middleware/authMiddleware";

const router = Router();

router.post("/", authorizeRoles("admin", "member"), createMeeting);
router.get("/", authorizeRoles("admin", "member"), getMeetings);

router.get(
  "/profile",
  authorizeRoles("admin", "member"),
  getLoggedINUserMeetings
);
router.get("/user/:id", authorizeRoles("admin"), getUserMeetings);

router
  .route("/:id")
  .get(authorizeRoles("admin", "member"), getMeeting)
  .patch(authorizeRoles("admin", "member"), updateMeeting)
  .delete(authorizeRoles("admin"), deleteMeeting);

export default router;
