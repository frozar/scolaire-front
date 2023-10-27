import { AssociatedSchoolType } from "../_entities/_utils.entity";
import { GradeTripType } from "../_entities/grade.entity";
import { StopType } from "../_entities/stop.entity";
import { getLines } from "../views/content/map/component/organism/BusLines";
import { getStops } from "../views/content/map/component/organism/StopPoints";

export namespace QuantityUtils {
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

  export function totalGradeQuantity(gradeId: number) {
    let quantity = 0;

    getStops()
      .flatMap((stop) => stop.associated)
      .filter((assoc) => assoc.gradeId == gradeId)
      .forEach((_assoc) => (quantity += _assoc.quantity));

    return quantity;
  }

  export function remainingGradeQuantity(gradeId: number) {
    const totalQuantity = totalGradeQuantity(gradeId);
    let usedQuantity = 0;

    getLines()
      .flatMap((line) => line.trips.flatMap((trip) => trip.tripPoints))
      .flatMap((tripPoint) => tripPoint.grades)
      .forEach((gradeTrip) => {
        if (gradeTrip.gradeId == gradeId) usedQuantity += gradeTrip.quantity;
      });

    return totalQuantity - usedQuantity;
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
}
