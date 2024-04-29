export type Driver = {
  name: string;
  birthDate: string;
  address: string;
  curp: string;
  licenseNumber: string;
  monthlySalary: number;
};

export type DriverPublic = Driver & {
  id: number;
};
