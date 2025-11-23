import { Router } from "express";
import {
  createRoom,
  deleteRoom,
  getRoom,
  getRooms,
  updateRoom,
} from "./room.controller";

const router = Router();

router.post("/", createRoom);
router.get("/", getRooms);
router.route("/:id").get(getRoom).patch(updateRoom).delete(deleteRoom);
export default router;
