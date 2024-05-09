import type { AssignmentPublic } from "./assignment";
import type { DriverPublic } from "./driver";

export type Route = {
  assignmentId: string;
  endLongitude: string;
  endLatitude: string;
  name: string;
  driveDate: string;
  comments: string | undefined;
};

export type RoutePublic = Route & {
  id: number;
  registrationDate: string;
  startLongitude: string;
  endLongitude: string;
  success: boolean | null;
  problemDescription: string | null;
  driver: DriverPublic;
  assignment: AssignmentPublic;
};
