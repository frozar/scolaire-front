export type TransporterType = {
  id?: number;
  name: string;
  type: string;
  allotment_id?: number;
  vehicles: TransporterVehicleType[];
};

export type TransporterVehicleType = {
  license: string;
  bus_category_id?: number;
};
