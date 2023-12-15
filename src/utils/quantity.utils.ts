import { AssociatedSchoolType } from "../_entities/_utils.entity";
import { CalendarDayEnum } from "../_entities/calendar.entity";
import { GradeTripType } from "../_entities/grade.entity";
import { StopType } from "../_entities/stop.entity";
import { TripDirectionEnum } from "../_entities/trip-direction.entity";
import { getLines } from "../views/content/map/component/organism/BusLines";

export type MatrixContentType = {
  goingQty: number;
  comingQty: number;
};

export type QuantityMatrixType = {
  monday: MatrixContentType;
  tuesday: MatrixContentType;
  wednesday: MatrixContentType;
  thursday: MatrixContentType;
  friday: MatrixContentType;
  saturday: MatrixContentType;
  sunday: MatrixContentType;
};

export namespace QuantityUtils {
  export function baseQuantityMatrix(
    days: CalendarDayEnum[],
    defaultQuantity = 0
  ): QuantityMatrixType {
    const content = {
      goingQty: defaultQuantity,
      comingQty: defaultQuantity,
    };

    const matrix: QuantityMatrixType = {} as QuantityMatrixType;
    days.forEach((day) => {
      matrix[day] = { ...content };
    });

    return matrix;
  }

  export function buildQuantityMatrix(
    days: CalendarDayEnum[],
    quantity: number,
    direction: TripDirectionEnum
  ) {
    const matrix: Partial<QuantityMatrixType> = {};
    Object.values(CalendarDayEnum).map((item) => {
      matrix[item] = { goingQty: 0, comingQty: 0 };
    });

    days.forEach((day) => {
      let out: { comingQty: number; goingQty: number };

      switch (direction) {
        case TripDirectionEnum.roundTrip:
          out = { comingQty: quantity, goingQty: quantity };
          break;
        case TripDirectionEnum.going:
          out = { comingQty: 0, goingQty: quantity };
          break;
        case TripDirectionEnum.coming:
          out = { comingQty: quantity, goingQty: 0 };
          break;
        default:
          out = { comingQty: 0, goingQty: 0 };
          break;
      }
      matrix[day] = out;
    });

    return matrix;
  }

  // TODO: Empêcher la création de plusieurs student to school ayant le même gradeId sur un même stop depuis le board "stop-details"
  export function remainingStudentToGradeQuantity(
    point: AssociatedSchoolType,
    stopId: number
  ) {
    const gradeId = point.gradeId;
    const gradeTrips = getLines()
      .flatMap((line) => line.trips)
      .flatMap((trip) => trip.tripPoints)
      .filter((tripPoint) => tripPoint.id == stopId)
      .flatMap((_tripPoint) => _tripPoint.grades)
      .filter((grade) => grade.gradeId == gradeId);
    if (gradeTrips.length == 0) return point.quantity;
    else {
      let usedQuantity = 0;
      gradeTrips.forEach((gradeTrip) => (usedQuantity += gradeTrip.quantity));
      return point.quantity - usedQuantity;
    }
  }

  export function updateGradeTripQuantity(
    grades: GradeTripType[],
    point: StopType
  ): GradeTripType[] {
    // Get all corresponding gradeTrip
    const gradeTrips = getLines()
      .flatMap((line) => line.trips)
      .flatMap((trip) => trip.tripPoints)
      .filter((tripPoint) => tripPoint.id == point.id)
      .flatMap((_tripPoint) => _tripPoint.grades);

    // Substract used quantity
    grades.forEach((grade) => {
      gradeTrips.forEach((_gradeTrip) => {
        if (_gradeTrip.gradeId == grade.gradeId) {
          grade.quantity -= _gradeTrip.quantity;
        }
      });
    });
    return grades;
  }

  export function calculateMatrix(
    orignal: QuantityMatrixType,
    toCalcul: QuantityMatrixType
  ): QuantityMatrixType {
    const days = Object.keys(orignal) as CalendarDayEnum[];
    if (!toCalcul && orignal) return orignal;

    const matrix: QuantityMatrixType = QuantityUtils.baseQuantityMatrix(days);

    days.forEach((day) => {
      matrix[day] = {
        comingQty: orignal[day].comingQty - toCalcul[day].comingQty,
        goingQty: orignal[day].goingQty - toCalcul[day].goingQty,
      };
    });
    return matrix;
  }
}
