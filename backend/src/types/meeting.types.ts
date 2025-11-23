export interface IMeeting {
  id: string;
  title: string;
  description: string;
  userId: string;
  startTime: string;
  endTime: string;
  status: boolean;
  roomId: string;
}
