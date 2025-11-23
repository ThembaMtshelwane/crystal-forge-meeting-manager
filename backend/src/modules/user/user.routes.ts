import { Router } from "express";
import {
  toogleUserstatus,
  getUser,
  getUserProfile,
  getUsers,
  updateUser,
} from "./user.controller";

const router = Router();

router.get("/", getUsers);
router.get("/profile", getUserProfile);
router.patch("/deactivate", toogleUserstatus);
router.route("/:id").get(getUser).patch(updateUser);

export default router;
