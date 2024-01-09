import { AssociatedSchoolType } from "../_entities/_utils.entity";
import { CalendarDayEnum } from "../_entities/calendar.entity";
import { GradeTripType } from "../_entities/grade.entity";
import { StopType } from "../_entities/stop.entity";
import { TripDirectionEnum } from "../_entities/trip-direction.entity";
import { NatureEnum } from "../type";
import { getLines } from "../views/content/map/component/organism/BusLines";
import {
  getStops,
  setStops,
} from "../views/content/map/component/organism/StopPoints";
import { updateStopDetailsItem } from "../views/content/stops/component/organism/StopDetails";
import { GradeUtils } from "./grade.utils";
import { QuantityUtils } from "./quantity.utils";

export namespace StopUtils {
  export function get(stopId: number): StopType {
    return getStops().filter((stop) => stop.id == stopId)[0];
  }

  export function getName(stopId: number): string {
    return get(stopId).name;
  }

  // Carefull, here stop name is used as an identifier
  export function getIdFromName(stopName: string): number {
    return getStops().filter((stop) => stop.name == stopName)[0].id;
  }

  export function addAssociated(
    gradeItem: AssociatedSchoolType,
    stopId: number
  ) {
    setStops((prev) => {
      const stops = [...prev];
      const indexOf = stops.findIndex((prev) => prev.id == stopId);
      stops[indexOf].associated.push(gradeItem);

      return stops;
    });
    updateStopDetailsItem(stopId);
  }

  export function removeAssociated(
    gradeStudentToGradeID: number,
    stopId: number
  ) {
    setStops((prev) => {
      const stops = [...prev];
      const indexOfStop = stops.findIndex((prev) => prev.id == stopId);

      stops[indexOfStop].associated = stops[indexOfStop].associated.filter(
        (prev) => prev.idClassToSchool != gradeStudentToGradeID
      );

      return stops;
    });
    updateStopDetailsItem(stopId);
  }

  export function updateAssociated(
    associated: AssociatedSchoolType,
    stopId: number
  ) {
    setStops((prev) => {
      const stops = [...prev].map((stop) => {
        return {
          ...stop,
          associated: stop.associated.map((assoc) =>
            assoc.idClassToSchool == associated.idClassToSchool
              ? associated
              : assoc
          ),
        };
      });

      return stops;
    });
    updateStopDetailsItem(stopId);
  }

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

  export function getGradeTrips(stopId: number): GradeTripType[] {
    return getLines()
      .flatMap((line) => line.trips)
      .flatMap((trip) => trip.tripPoints)
      .filter(
        (tripPoint) =>
          tripPoint.nature == NatureEnum.stop && tripPoint.id == stopId
      )
      .flatMap((_tripPoint) => _tripPoint.grades);
  }

  // * Here get the remaining quantity by direction & days
  export function getRemainingQuantityFromMatrixOfGrades(
    stopId: number,
    gradeIds: number[],
    tripDirection: TripDirectionEnum,
    days: CalendarDayEnum[]
  ) {
    console.log("getRemainingQuantityFromMatrixOfGrades");
    const totalQuantity = getTotalQuantityFromGradeIds(stopId, gradeIds);
    const stopGrades = StopUtils.get(stopId).associated;
    const grades = getGradeTrips(stopId);
    let usedQuantity = 0;

    grades
      .filter((grade) => gradeIds.includes(grade.gradeId))
      .forEach((_grade) => {
        const stopGradeMatrix = stopGrades.filter(
          (item) => item.gradeId == _grade.gradeId
        )[0].quantityMatrix;

        const calculatedMatrix = QuantityUtils.calculateMatrix(
          stopGradeMatrix,
          _grade.matrix
        );

        days.forEach((item) => {
          switch (tripDirection) {
            // Todo lucas direction is inversed
            case TripDirectionEnum.coming:
              usedQuantity +=
                calculatedMatrix[item as CalendarDayEnum].goingQty;
              break;
            // Todo lucas direction is inversed
            case TripDirectionEnum.going:
              usedQuantity +=
                calculatedMatrix[item as CalendarDayEnum].comingQty;
              break;
          }
        });
      });

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
      .flatMap((trip) => trip.tripPoints)
      .filter(
        (tripPoint) =>
          tripPoint.nature == NatureEnum.stop && tripPoint.id == stopId
      )
      .flatMap((_tripPoint) => _tripPoint.grades)
      .filter(
        (gradeTrip) => GradeUtils.getSchoolId(gradeTrip.gradeId) == schoolId
      )
      .forEach((grade) => (usedQuantity += grade.quantity));

    return totalQuantity - usedQuantity;
  }
}
