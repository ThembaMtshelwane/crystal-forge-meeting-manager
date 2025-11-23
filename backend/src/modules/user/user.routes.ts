import { Router } from "express";
import {
  toogleUserstatus,
  getUser,
  getUserProfile,
  getUsers,
  updateUser,
} from "./user.controller";
import { protect } from "../../middleware/authMiddleware";

const router = Router();

router.get("/", getUsers);
router.get("/profile", protect, getUserProfile);
router.patch("/deactivate", toogleUserstatus);
router.route("/:id").get(getUser).patch(updateUser);

export default router;
