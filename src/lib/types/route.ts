export type Route = {
    assignmentId: string;
    startLongitude: number;
    startLatitude: number;
    endLongitude: number;
    endLatitude: number;
    name: string;
    driveDate: string;
    success: boolean | null;
    problemDescription: string;
    comments: string;
}

export type RoutePublic = Route & {
    id: number;
    registrationDate: string;
  };
  