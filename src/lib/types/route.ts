import { AssignmentPublic } from "./assignment";
import { DriverPublic } from "./driver";

export type Route = {
    assignmentId: string;
    startLongitude: number;
    startLatitude: number;
    endLongitude: number;
    endLatitude: number;
    name: string;
    driveDate: string;
    success: boolean | null;
    problemDescription: string | null;
    comments: string | null;
    assignment: AssignmentPublic;
    driver: DriverPublic;
}

export type RoutePublic = Route & {
    id: number;
    registrationDate: string;
  };
  