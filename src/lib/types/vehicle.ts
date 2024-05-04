type VehicleBase = {
  make: string;
  model: string;
  vin: string;
  cost: number;
  licensePlate: string;
  purchaseDate: string;
};

export type VehicleInputs = VehicleBase & {
  fileList: FileList;
};

export type VehicleEditInputs = VehicleBase;

export type VehiclePublic = VehicleBase & {
  id: number;
  photoUrl: string;
};
