import { SchoolType } from "../_entities/school.entity";
import { StopType } from "../_entities/stop.entity";
import { TripDirectionEnum } from "../_entities/trip-direction.entity";
import { TripPointType } from "../_entities/trip.entity";
import { ServiceUtils } from "./_utils.service";

const host = import.meta.env.VITE_BACK_URL;

export class GraphicageService {
  static async drawHelper(data: DrawHelperDataType) {
    return await ServiceUtils.generic(host + "/generator/draw-helper", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
}

export type DrawHelperDataType = {
  schools: SchoolType[];
  selected: TripPointType[];
  stops: StopType[];
  capacity: number;
  timeLimitSeconds: number;
  nbLimitSolution: number;
  direction: TripDirectionEnum;
};
