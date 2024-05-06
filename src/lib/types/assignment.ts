export type Assignment = {
  vehicleId: number;
  driverId: number;
};

export type AssignmentPublic = Assignment & {
  id: number;
};
