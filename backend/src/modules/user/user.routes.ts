import { Router } from "express";
import {
  toogleUserstatus,
  getUser,
  getUserProfile,
  getUsers,
  updateUser,
} from "./user.controller";
import { authorizeRoles } from "../../middleware/authMiddleware";

const router = Router();

router.get("/", getUsers);
router.get("/profile", authorizeRoles("admin", "member"), getUserProfile);
router.patch("/deactivate", authorizeRoles("admin"), toogleUserstatus);
router
  .route("/:id")
  .get(authorizeRoles("admin", "member"), getUser)
  .patch(updateUser); // #TODO: Add that a user can update their own data

export default router;
