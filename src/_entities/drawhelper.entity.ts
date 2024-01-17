import { DrawHelperDataType } from "../_services/graphicage.service";
import { QuantityUtils } from "../utils/quantity.utils";
import { currentDrawTrip } from "../views/content/board/component/organism/DrawTripBoard";
import { getSchools } from "../views/content/map/component/organism/SchoolPoints";
import {
  getStops,
  leafletStopsFilter,
} from "../views/content/map/component/organism/StopPoints";
import { CalendarDayEnum } from "./calendar.entity";
import { GradeTripType } from "./grade.entity";
import { SchoolType } from "./school.entity";
import { TripDirectionEntity } from "./trip-direction.entity";
import { TripPointType } from "./trip.entity";

export namespace DrawHelperEntity {
  export function format(
    capacity: number,
    timeLimitSeconds: number,
    nbLimitSolution: number,
    schools: SchoolType[]
  ): DrawHelperDataType {
    return {
      schools: schools,
      selected: currentDrawTrip()?.tripPoints ?? [],
      stops: leafletStopsFilter(),
      capacity: capacity,
      timeLimitSeconds: timeLimitSeconds,
      nbLimitSolution: nbLimitSolution,
      direction: TripDirectionEntity.FindDirectionById(
        currentDrawTrip().tripDirectionId
      ).type,
    };
  }

  export function formatTripPoints(
    data: { leafletId: number; nature: string; quantity: number }[]
  ): TripPointType[] {
    const points = [...getSchools(), ...getStops()];
    const output = [];

    for (const item of data) {
      const point = points.find((point) => item.leafletId == point.leafletId);

      const gradeTrip: GradeTripType[] =
        point?.associated.map((item) => {
          return {
            gradeId: item.gradeId,
            quantity: item.quantity,
            matrix: QuantityUtils.baseQuantityMatrix(
              Object.values(CalendarDayEnum),
              item.quantity
            ),
          };
        }) ?? [];

      if (point) {
        output.push({
          ...point,
          grades: gradeTrip,
          passageTime: 0,
          startToTripPointDistance: 0,
        });
      }
    }
    return output;
  }
}
