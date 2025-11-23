import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import express, { Response, Request } from "express";
import roomRouter from "./modules/room/room.routes";
import userRouter from "./modules/user/user.routes";
import authRouter from "./modules/auth/auth.routes";
import { protect } from "./middleware/authMiddleware";

const app = express();
const PORT = 5000;

const allowedOrigins = ["http://localhost:3000"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "PATCH", "PUT", "DELETE", "POST"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({});
});

app.use("/api/auth", authRouter);
app.use("/api/rooms", protect, roomRouter);
app.use("/api/users", protect, userRouter);
app.use("/api/organizations", protect, userRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
