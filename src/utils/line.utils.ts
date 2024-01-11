import { CalendarDayEnum } from "../_entities/calendar.entity";
import { GradeTripType } from "../_entities/grade.entity";
import { LineType } from "../_entities/line.entity";
import { NatureEnum } from "../type";
import { QuantityMatrixType } from "./quantity.utils";

enum GoingComingQtyEnum {
  goingQty = "goingQty",
  comingQty = "comingQty",
}

export namespace LineUtils {
  function updateMatrixQuantityWithNewQty(
    matrix: QuantityMatrixType,
    qty: number
  ) {
    const days = Object.keys(CalendarDayEnum) as CalendarDayEnum[];
    const directions = Object.keys(GoingComingQtyEnum) as GoingComingQtyEnum[];

    for (const day of days) {
      for (const direction of directions) {
        matrix[day][direction] = matrix[day][direction] == 0 ? 0 : qty;
      }
    }

    return matrix;
  }
  export function updateLineWithNewGradeTripMatrix(
    lines: LineType[],
    qty: number,
    gradeId: number,
    stopId: number
  ): LineType[] {
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
