import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { db, saveDB } from "../../utils/fileDb";
import { HttpStatus } from "../../constants/http.codes";
import { IRoom } from "../../types/room.types";
import { randomUUID } from "crypto";

// Create a room
export const createRoom = (req: Request, res: Response) => {
  const { name, capacity, description, location } = req.body;

  const rooms = (db.rooms as IRoom[]).filter(
    (r) => r.name === name || r.location === location
  );

  if (rooms.length !== 0) {
    res.status(HttpStatus.BAD_REQUEST).json({
      message: "Room already exists",
    });
    throw new Error("Room already exists");
  }

  const newRoom: IRoom = {
    id: randomUUID(),
    name,
    capacity,
    description,
    location,
    organisationId: "org1",
    meetings: [],
  };

  db.rooms.push(newRoom);
  saveDB(db);

  if (!newRoom) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Error: Failed to created a room",
    });
    throw new Error("Error: Failed to created a room");
  }
  res
    .status(HttpStatus.CREATED)
    .json({ data: newRoom, message: "You have successfully added a new room" });
};

// Get all rooms
export const getRooms = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const data = db.rooms;
    if (!data) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "No rooms found",
      });
      return;
    }
    res.status(HttpStatus.OK).json({ data, messgae: "Fetched all rooms" });
  }
);

// Get a room by id
export const getRoom = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const room = (db.rooms as IRoom[]).find((r) => r.id === id);
    if (!room) {
      res.status(HttpStatus.NOT_FOUND).json({ message: "Room not found" });
      return;
    }
    res.status(HttpStatus.OK).json({
      data: room,
      message: "Room found",
    });
  }
);

// Update a room
export const updateRoom = (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const roomIndex = db.rooms.findIndex((r: IRoom) => r.id === id);

  if (roomIndex === -1) {
    return res.status(HttpStatus.NOT_FOUND).json({ message: "Room not found" });
  }

  // Filter out undefined fields
  const sanitizedUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, value]) => value !== undefined)
  );

  // Merge safely into existing room
  db.rooms[roomIndex] = {
    ...db.rooms[roomIndex],
    ...sanitizedUpdates,
  };

  saveDB(db);

  res.status(HttpStatus.OK).json(db.rooms[roomIndex]);
};

// Delete a room
export const deleteRoom = (req: Request, res: Response) => {
  const { id } = req.params;

  const index = db.rooms.findIndex((r: IRoom) => r.id === id);
  if (index === -1)
    return res.status(HttpStatus.NOT_FOUND).json({ message: "Room not found" });

  db.rooms.splice(index, 1);
  saveDB(db);

  res.json({ message: "Room deleted" });
};
