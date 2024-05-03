export type Vehicle = {
    make: string;
    model: string;
    vin: string;
    cost: number;
    licensePlate: string;
    purchaseDate: string;
    photoURL: string;
}

export type VehiclePublic = Vehicle & {
    id: number;
}