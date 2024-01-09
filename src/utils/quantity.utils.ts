import { AssociatedSchoolType } from "../_entities/_utils.entity";
import { CalendarDayEnum } from "../_entities/calendar.entity";
import { TripDirectionEnum } from "../_entities/trip-direction.entity";
import { TripPointType } from "../_entities/trip.entity";
import { NatureEnum } from "../type";
import { getLines } from "../views/content/map/component/organism/BusLines";
import { getStops } from "../views/content/map/component/organism/StopPoints";
import { GradeUtils } from "./grade.utils";
import { StopUtils } from "./stop.utils";
import { TripUtils } from "./trip.utils";

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

  export function calculateMatrix(
    orignal: QuantityMatrixType,
    toCalcul: QuantityMatrixType
  ): QuantityMatrixType {
    console.log("orignal matrix =>", orignal);
    console.log("toCalcul matrix =>", toCalcul);

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

  export function haveSchoolBefore(
    tripPoints: TripPointType[],
    indice: number
  ) {
    if (indice == 0 && tripPoints[indice].nature == NatureEnum.stop) {
      return false;
    }
    const sliced = tripPoints.slice(0, indice);
    return sliced.some((item) => item.nature == NatureEnum.school);
  }

  export function getTripTotalQuantities(tripPoints: TripPointType[]) {
    let tripTotalQuantities = 0;

    //* For each stops add each grade quantity to SchoolStartQuantity
    tripPoints.forEach((points, index) => {
      if (
        points.nature == NatureEnum.stop &&
        haveSchoolBefore(tripPoints, index)
      )
        tripTotalQuantities += points.grades.reduce(
          (total, item) => total + item.quantity,
          0
        );
    });

    return tripTotalQuantities;
  }

  /*
   * Here first i check if the indexed points is after a school, if not exit & set his Quantity to 0
   * then I recover the tripoint table cut so as to recover only the points which are after a school
   * then i get the total quantity of the trip
   * then if the point is school set his quantity to the total quantity
   * else calcul the remaining quantity to drop for the indexed stop
   **/
  export function DropQuantity(tripPoints: TripPointType[], indice: number) {
    if (
      !QuantityUtils.haveSchoolBefore(tripPoints, indice) &&
      tripPoints[indice].nature != NatureEnum.school
    ) {
      return 0;
    }

    // * Get splitted array
    const slicedTripPoint =
      TripUtils.getSplitedTripPointsAtFirstSchoolPosition(tripPoints);

    // * Redefine the indice compared to the new table
    indice = slicedTripPoint.findIndex(
      (item) => item.id == tripPoints[indice].id
    );

    let tripTotalQuantities =
      QuantityUtils.getTripTotalQuantities(slicedTripPoint);

    switch (slicedTripPoint[indice].nature) {
      case NatureEnum.school:
        return tripTotalQuantities;
      case NatureEnum.stop:
        // * For each point before the current point add these quantities if they has a school before them
        slicedTripPoint.every((item, index) => {
          if (
            index > indice ||
            !QuantityUtils.haveSchoolBefore(slicedTripPoint, indice)
          ) {
            return false;
          } else {
            return (tripTotalQuantities -= item.grades.reduce(
              (total, grade) => total + grade.quantity,
              0
            ));
          }
        });
        break;
    }

    return tripTotalQuantities;
  }

  export function SumQuantity(tripPoints: TripPointType[], indice: number) {
    let sum = 0;
    let grades: { gradeId: number; schoolId: number; quantity: number }[] = [];
    for (let i = 0; i < indice + 1; i++) {
      const gradesOfCurrentPoint = tripPoints[i].grades.map((grade) => {
        return {
          gradeId: grade.gradeId,
          schoolId: GradeUtils.getSchoolId(grade.gradeId),
          quantity: grade.quantity,
        };
      });
      grades.push(...gradesOfCurrentPoint);

      switch (tripPoints[i].nature) {
        case NatureEnum.stop:
          gradesOfCurrentPoint.forEach((grade) => (sum += grade.quantity));
          break;
        case NatureEnum.school:
          let quantityToSubstract = 0;
          grades.forEach((grade) => {
            if (GradeUtils.getSchoolId(grade.gradeId) == tripPoints[i].id) {
              quantityToSubstract += grade.quantity;
            }
          });
          grades = grades.filter(
            (grade) => GradeUtils.getSchoolId(grade.gradeId) != tripPoints[i].id
          );
          sum -= quantityToSubstract;
          break;
      }
    }

    return sum;
  }

  export function getRemainingQuantityMatrix(
    stopId: number,
    idClassToSchool: number
  ): QuantityMatrixType {
    console.log("getRemainingQuantityMatrix");
    const stop = getStops().filter((stop) => stop.id == stopId)[0];
    const associated = stop.associated.filter(
      (associated) => associated.idClassToSchool == idClassToSchool
    )[0];

    const orignalMatrix = associated.quantityMatrix as QuantityMatrixType;
    const tripMatrix: QuantityMatrixType[] = StopUtils.getGradeTrips(stopId)
      .filter((item) => item.gradeId == associated.gradeId)
      .flatMap((item) => item.matrix) as QuantityMatrixType[];

    let displayMatrix = QuantityUtils.calculateMatrix(
      orignalMatrix,
      tripMatrix[0]
    );

    if (tripMatrix.length > 1)
      displayMatrix = QuantityUtils.calculateMatrix(
        displayMatrix,
        tripMatrix[1]
      );

    return displayMatrix;
  }

  // * TODO move it to stop utils
  export function stopHasRemainingStudentToGet(
    stopId: number,
    returnByDirection = false
  ): boolean | [boolean, boolean] {
    let goingDirection = false;
    let comingDirection = false;

    const matrixs: QuantityMatrixType[] = [];
    const stop = getStops().filter((stop) => stop.id == stopId)[0];

    // * Get matrix of all stop association
    stop.associated.forEach((assoicated) => {
      const quantityMatrix = QuantityUtils.getRemainingQuantityMatrix(
        stop.id,
        assoicated.idClassToSchool
      );

      matrixs.push(quantityMatrix);
    });

    matrixs.map((matrix) => {
      Object.values(matrix).forEach((matrix) => {
        if (matrix.comingQty > 0) comingDirection = true;
        if (matrix.goingQty > 0) goingDirection = true;
      });
    });

    if (!returnByDirection) {
      if (goingDirection != comingDirection) return true;
      else if (goingDirection && goingDirection) return true;
      else return false;
    } else return [goingDirection, comingDirection];
  }
}
