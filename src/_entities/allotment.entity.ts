export namespace AllotmentEntity {
  export function build(dbAllotment: AllotmentDBType): AllotmentType {
    return {
      id: dbAllotment.id,
      color: dbAllotment.color,
      name: dbAllotment.name,
      vehicleCost: dbAllotment.vehicle_cost.map((item) => {
        return buildVehicleCost(item);
      }),
    };
  }

  export function DbFormat(allotment: AllotmentType): AllotmentDBType {
    return {
      id: allotment.id,
      color: allotment.color,
      name: allotment.name,
      vehicle_cost: allotment.vehicleCost.map((item) => {
        return formatVehicleCost(item);
      }),
    };
  }
}

function buildVehicleCost(cost: AllotmentCostDBType): AllotmentCostType {
  return {
    busCategoryId: cost.bus_category_id,
    cost: cost.cost,
    costHlp: cost.cost_hlp,
  };
}

function formatVehicleCost(cost: AllotmentCostType): AllotmentCostDBType {
  return {
    bus_category_id: cost.busCategoryId,
    cost: cost.cost,
    cost_hlp: cost.costHlp,
  };
}

export type AllotmentType = {
  id?: number;
  name: string;
  color: string;
  vehicleCost: AllotmentCostType[];
};

export type AllotmentCostType = {
  busCategoryId: number;
  cost: number;
  costHlp: number;
};

export type AllotmentDBType = {
  id?: number;
  name: string;
  color: string;
  vehicle_cost: AllotmentCostDBType[];
};

export type AllotmentCostDBType = {
  bus_category_id: number;
  cost: number;
  cost_hlp: number;
};
