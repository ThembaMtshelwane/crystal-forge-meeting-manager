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

const router = Router();

router.post("/", createMeeting);
router.get("/", getMeetings);

router.get("/profile", getLoggedINUserMeetings);
router.get("/user/:id", getUserMeetings);

router.route("/:id").get(getMeeting).patch(updateMeeting).delete(deleteMeeting);

export default router;
