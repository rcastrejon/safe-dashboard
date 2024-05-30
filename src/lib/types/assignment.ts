import type { DriverPublic } from "./driver";
import type { VehiclePublic } from "./vehicle";

export type Assignment = {
  vehicleId: string;
  driverId: string;
};

export type AssignmentPublic = Assignment & {
  id: string;
  registrationDate: string;
  driver: DriverPublic;
  vehicle: VehiclePublic;
  isActive: boolean;
  labelName: DriverPublic & VehiclePublic;
};
