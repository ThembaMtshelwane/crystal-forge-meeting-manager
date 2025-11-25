export interface IMeetingCreate {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  date: string;
  roomId: string;
}

export interface IMeetingResponse extends IMeetingCreate {
  id: string;
  userId: string;
  status: boolean;
}
