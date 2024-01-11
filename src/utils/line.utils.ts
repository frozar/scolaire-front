import { CalendarDayEnum } from "../_entities/calendar.entity";
import { GradeTripType } from "../_entities/grade.entity";
import { LineType } from "../_entities/line.entity";
import { NatureEnum } from "../type";
import { QuantityMatrixType } from "./quantity.utils";

export namespace LineUtils {
  export function updateLineWithNewGradeTripMatrix(
    lines: LineType[],
    qty: number,
    gradeId: number,
    stopId: number
  ): LineType[] {
    enum GoingComingQtyEnum {
      goingQty = "goingQty",
      comingQty = "comingQty",
    }

    function updateMatrixQuantityWithNewQty(
      matrix: QuantityMatrixType,
      qty: number
    ) {
      for (const day of Object.keys(CalendarDayEnum) as CalendarDayEnum[]) {
        for (const direction of Object.keys(
          GoingComingQtyEnum
        ) as GoingComingQtyEnum[]) {
          matrix[day][direction] = matrix[day][direction] == 0 ? 0 : qty;
        }
      }

      return matrix;
    }

    return lines.flatMap((line) => {
      return {
        ...line,
        trips: line.trips.flatMap((trip) => {
          return {
            ...trip,
            tripPoints: trip.tripPoints.flatMap((tripPoint) => {
              return {
                ...tripPoint,
                grades: tripPoint.grades.map((gradeTrip): GradeTripType => {
                  if (
                    gradeTrip.gradeId == gradeId &&
                    tripPoint.nature == NatureEnum.stop &&
                    tripPoint.id == stopId
                  ) {
                    return {
                      ...gradeTrip,
                      quantity: qty,
                      matrix: updateMatrixQuantityWithNewQty(
                        gradeTrip.matrix,
                        qty
                      ),
                    };
                  } else return gradeTrip;
                }),
              };
            }),
          };
        }),
      };
    });
  }
}
