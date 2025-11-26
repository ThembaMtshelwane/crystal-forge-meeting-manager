import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { IMeeting } from "../../types/meeting.types";
import { db, saveDB } from "../../utils/fileDb";
import { HttpStatus } from "../../constants/http.codes";
import { randomUUID } from "crypto";
import { IUser } from "../../types/user.types";

// Create/book a meeting
export const createMeeting = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { title, description, startTime, endTime, roomId, date } = req.body;

    //#TODO: Update the checks, make sure there are no double bookings
    const meetings = (db.meetings as IMeeting[]).filter(
      (m) =>
        m.startTime === startTime &&
        m.endTime === endTime &&
        m.title === title &&
        m.roomId === roomId
    );

    if (meetings.length !== 0) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: "Meeting already exists",
      });
      return;
    }

    const newMeeting: IMeeting = {
      id: randomUUID(),
      title,
      description,
      userId: req.user?.id as string,
      startTime,
      endTime,
      date,
      status: true,
      roomId,
    };
    db.meetings.push(newMeeting);
    saveDB(db);

    if (!newMeeting) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Error: Failed to created a meeting",
      });
    }
    res.status(HttpStatus.CREATED).json({
      data: newMeeting,
      message: "You have successfully added a new meeting",
    });
  }
);

// Get all meetings
export const getMeetings = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const data = db.meetings;
    if (!data) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "No meetings found",
      });
      return;
    }
    res.status(HttpStatus.OK).json({ data, messgae: "Fetched all meetings" });
  }
);

// Get a meeting
export const getMeeting = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const meeting = (db.meetings as IMeeting[]).find((m) => m.id === id);
    if (!meeting) {
      res.status(HttpStatus.NOT_FOUND).json({ message: "Meeting not found" });
      return;
    }
    res.status(HttpStatus.OK).json({
      data: meeting,
      message: "Meeting found",
    });
  }
);

// Get a user's meetings
export const getUserMeetings = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const data = (db.meetings as IMeeting[]).filter((m) => m.userId === id);

    if (data.length !== 0 && !data) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "No rooms found",
      });
      return;
    }
    res
      .status(HttpStatus.OK)
      .json({ data, messgae: "Fetched all user's meetings" });
  }
);

// Get logged in user's meeting
export const getLoggedINUserMeetings = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const data = (db.meetings as IMeeting[]).filter(
      (m) => m.userId === req.user?.id
    );

    if (data.length !== 0 && !data) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "No user meetings found",
      });
      return;
    }
    res
      .status(HttpStatus.OK)
      .json({ data, messgae: "Fetched all user's meetings" });
  }
);
export const updateMeeting = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;

    const meetingIndex = db.meetings.findIndex((m: IMeeting) => m.id === id);

    if (meetingIndex === -1) {
      res.status(HttpStatus.NOT_FOUND).json({ message: "meeting not found" });
      return;
    }

    // Filter out undefined fields
    const sanitizedUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    // Merge safely into existing meeting
    db.meetings[meetingIndex] = {
      ...db.meetings[meetingIndex],
      ...sanitizedUpdates,
    };

    saveDB(db);

    res.status(HttpStatus.OK).json(db.meetings[meetingIndex]);
  }
);

// Delete a meeting
export const deleteMeeting = (req: Request, res: Response) => {
  const { id } = req.params;

  const index = db.meetings.findIndex((m: IMeeting) => m.id === id);
  if (index === -1)
    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: "meeting not found" });

  db.meetings.splice(index, 1);
  saveDB(db);

  res.json({ message: "meeting deleted" });
};
