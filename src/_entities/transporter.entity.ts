export namespace TransporterEntity {
  export function build(dbTransporter: TransporterDbType): TransporterType {
    return {
      id: dbTransporter.id,
      name: dbTransporter.name,
      type: dbTransporter.type,
      allotmentId: dbTransporter.allotment_id,
      vehicles: dbTransporter.vehicles.map((vehicle) => buildVehicle(vehicle)),
      costs: dbTransporter.vehicle_cost.map((cost) => buildCost(cost)),
    };
  }

  export function dbFormat(transporter: TransporterType): TransporterDbType {
    return {
      id: transporter.id,
      name: transporter.name,
      type: transporter.type,
      allotment_id: transporter.allotmentId,
      vehicles: transporter.vehicles.map((vehicle) => formatVehicle(vehicle)),
      vehicle_cost: transporter.costs.map((cost) => formatCost(cost)),
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

function buildCost(dbCost: TransporterCostDbType): TransporterCostType {
  return {
    busCategoryId: dbCost.bus_categories_id,
    cost: dbCost.cost,
    costHlp: dbCost.cost_hlp,
  };
}

function formatCost(cost: TransporterCostType): TransporterCostDbType {
  return {
    bus_categories_id: cost.busCategoryId,
    cost: cost.cost,
    cost_hlp: cost.costHlp,
  };
}

export type TransporterType = {
  id?: number;
  name: string;
  type: string;
  allotmentId?: number;
  vehicles: TransporterVehicleType[];
  costs: TransporterCostType[];
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
  vehicle_cost: TransporterCostDbType[];
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
