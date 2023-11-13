import { GradeTripType } from "../_entities/grade.entity";
import { NatureEnum } from "../type";
import { getLines } from "../views/content/map/component/organism/BusLines";
import { getStops } from "../views/content/map/component/organism/StopPoints";

// TODO: Refactor
export namespace StopUtils {
  export function getTotalQuantity(stopId: number) {
    let quantity = 0;
    const stop = getStops().filter((stop) => stop.id == stopId)[0];

    stop.associated.forEach((assoc) => (quantity += assoc.quantity));

    return quantity;
  }

  function getTotalQuantityFromGradeIds(stopId: number, gradeIds: number[]) {
    let quantity = 0;
    const stop = getStops().filter((stop) => stop.id == stopId)[0];

    stop.associated.forEach((assoc) => {
      if (gradeIds.includes(assoc.gradeId)) quantity += assoc.quantity;
    });

    return quantity;
  }

  function getGradeTrips(stopId: number): GradeTripType[] {
    return getLines()
      .flatMap((line) => line.trips)
      .flatMap((trip) => trip.tripPoints)
      .filter(
        (tripPoint) =>
          tripPoint.nature == NatureEnum.stop && tripPoint.id == stopId
      )
      .flatMap((_tripPoint) => _tripPoint.grades);
  }

  export function getRemainingQuantity(stopId: number) {
    const totalQuantity = getTotalQuantity(stopId);

    let usedQuantity = 0;
    const grades = getGradeTrips(stopId);
    grades.forEach((grade) => (usedQuantity += grade.quantity));

    return totalQuantity - usedQuantity;
  }

  // TODO:
  export function getRemainingQuantityFromGradeIds(
    stopId: number,
    gradeIds: number[]
  ) {
    const totalQuantity = getTotalQuantityFromGradeIds(stopId, gradeIds);

    let usedQuantity = 0;
    const grades = getGradeTrips(stopId);
    grades
      .filter((grade) => gradeIds.includes(grade.gradeId))
      .forEach((_grade) => (usedQuantity += _grade.quantity));

    return totalQuantity - usedQuantity;
  }

  export function getTotalQuantityPerSchool(stopId: number, schoolId: number) {
    let quantity = 0;
    const stop = getStops().filter((stop) => stop.id == stopId)[0];

    stop.associated.forEach((assoc) => {
      if (assoc.schoolId == schoolId) {
        quantity += assoc.quantity;
      }
    });

    return quantity;
  }

  export function getRemainingQuantityPerSchool(
    stopId: number,
    schoolId: number
  ) {
    const totalQuantity = getTotalQuantityPerSchool(stopId, schoolId);

    let usedQuantity = 0;
    getLines()
      .flatMap((line) => line.trips)
      // TODO: Use grade school destination instead !
      .filter((trip) => trip.schools[0].id == schoolId)
      .flatMap((_trip) => _trip.tripPoints)
      .filter(
        (tripPoint) =>
          tripPoint.nature == NatureEnum.stop && tripPoint.id == stopId
      )
      .flatMap((_tripPoint) => _tripPoint.grades)
      .forEach((grade) => (usedQuantity += grade.quantity));

    return totalQuantity - usedQuantity;
  }
}
