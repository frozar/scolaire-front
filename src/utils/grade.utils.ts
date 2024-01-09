import { GradeType } from "../_entities/grade.entity";
import {
  TripDirectionEntity,
  TripDirectionEnum,
} from "../_entities/trip-direction.entity";
import { getLines } from "../views/content/map/component/organism/BusLines";
import { getSchools } from "../views/content/map/component/organism/SchoolPoints";
import { getStops } from "../views/content/map/component/organism/StopPoints";

export namespace GradeUtils {
  export function getGrade(gradeId: number): GradeType {
    return getSchools()
      .flatMap((school) => school.grades)
      .filter((grade) => grade.id == gradeId)[0];
  }

  export function getAll(): GradeType[] {
    return getSchools().flatMap((school) => school.grades);
  }

  export function getName(gradeId: number): string {
    return getGrade(gradeId).name;
  }

  export function getSchoolId(gradeId: number): number {
    return getSchools().filter((school) =>
      school.grades.some((grade) => grade.id == gradeId)
    )[0].id;
  }

  // Carefull, here grade name is used as an identifier
  export function getIdFromName(gradeName: string): number {
    return getAll().filter((grade) => grade.name == gradeName)[0].id as number;
  }

  export function getTotalQuantity(gradeId: number) {
    let quantity = 0;

    getStops()
      .flatMap((stop) => stop.associated)
      .filter((assoc) => assoc.gradeId == gradeId)
      .forEach((_assoc) => (quantity += _assoc.quantity));

    return quantity;
  }

  export function getRemainingQuantity(gradeId: number) {
    const totalQuantity = getTotalQuantity(gradeId);
    let usedQuantity = 0;

    getLines()
      .flatMap((line) => line.trips.flatMap((trip) => trip.tripPoints))
      .flatMap((tripPoint) => tripPoint.grades)
      .forEach((gradeTrip) => {
        if (gradeTrip.gradeId == gradeId) usedQuantity += gradeTrip.quantity;
      });

    return totalQuantity - usedQuantity;
  }

  export function getRemainingQuantityForDirection(
    gradeId: number,
    direction: TripDirectionEnum
  ) {
    const totalQuantity = getTotalQuantity(gradeId);
    let usedQuantity = 0;

    getLines()
      .flatMap((line) =>
        line.trips
          .filter(
            (item) =>
              TripDirectionEntity.FindDirectionById(item.tripDirectionId)
                .type == direction
          )
          .flatMap((trip) => trip.tripPoints)
      )
      .flatMap((tripPoint) => tripPoint.grades)
      .forEach((gradeTrip) => {
        if (gradeTrip.gradeId == gradeId) usedQuantity += gradeTrip.quantity;
      });

    return totalQuantity - usedQuantity;
  }
}
