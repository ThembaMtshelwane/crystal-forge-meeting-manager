import { Router } from "express";
import {
  createRoom,
  deleteRoom,
  getRoom,
  getRooms,
  updateRoom,
} from "./room.controller";
import { authorizeRoles } from "../../middleware/authMiddleware";

const router = Router();

router.post("/", authorizeRoles("admin"), createRoom);
router.get("/", authorizeRoles("admin", "member"), getRooms);
router
  .route("/:id")
  .get(authorizeRoles("admin", "member"), getRoom)
  .patch(authorizeRoles("admin"), updateRoom)
  .delete(authorizeRoles("admin", "member"), deleteRoom);
export default router;
