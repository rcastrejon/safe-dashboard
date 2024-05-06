import type { DriverPublic } from "./driver";
import type { VehiclePublic } from "./vehicle";

export type Assignment = {
  vehicleId: number;
  driverId: number;
  isActive: boolean;
  vehicle: VehiclePublic;
  driver: DriverPublic;
  registrationDate: string;
};

export type AssignmentPublic = Assignment & {
  id: number;
};
