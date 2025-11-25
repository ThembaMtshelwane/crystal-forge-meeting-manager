export interface IRoomCreate {
  name: string;
  description: string;
  location: string;
  capacity: string;
}

export interface IRoomResponse extends IRoomCreate {
  id: string;
  organisationId: string;
  meetings: string[];
}
