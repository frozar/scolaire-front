export namespace TransporterEntity {
  export function build(dbTransporter: TransporterDbType): TransporterType {
    return {
      id: dbTransporter.id,
      name: dbTransporter.name,
      type: dbTransporter.type,
      allotmentId: dbTransporter.allotment_id,
      vehicles: dbTransporter.vehicles.map((vehicle) => buildVehicle(vehicle)),
    };
  }

  export function dbFormat(transporter: TransporterType): TransporterDbType {
    return {
      id: transporter.id,
      name: transporter.name,
      type: transporter.type,
      vehicles: transporter.vehicles.map((vehicle) => formatVehicle(vehicle)),
    };
  }
}

function buildVehicle(
  dbVehicle: TransporterVehicleDbType
): TransporterVehicleType {
  return {
    license: dbVehicle.license,
    busCategoryId: dbVehicle.bus_categories_id,
  };
}

function formatVehicle(
  vehicle: TransporterVehicleType
): TransporterVehicleDbType {
  return {
    license: vehicle.license,
    bus_categories_id: vehicle.busCategoryId,
  };
}

export type TransporterType = {
  id?: number;
  name: string;
  type: string;
  allotmentId?: number;
  vehicles: TransporterVehicleType[];
};

export type TransporterVehicleType = {
  license: string;
  busCategoryId?: number;
};

export type TransporterCostType = {
  busCategoryId: number;
  cost: number;
  costHlp: number;
};

export type TransporterDbType = {
  id?: number;
  name: string;
  type: string;
  allotment_id?: number;
  vehicles: TransporterVehicleType[];
};

export type TransporterVehicleDbType = {
  license: string;
  bus_categories_id?: number;
};

export type TransporterCostDbType = {
  bus_categories_id: number;
  cost: number;
  cost_hlp: number;
};
