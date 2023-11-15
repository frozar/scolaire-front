import { GradeType } from "../_entities/grade.entity";
import { getLines } from "../views/content/map/component/organism/BusLines";
import { getSchools } from "../views/content/map/component/organism/SchoolPoints";
import { getStops } from "../views/content/map/component/organism/StopPoints";

export namespace GradeUtils {
  function getGrade(gradeId: number): GradeType {
    return getSchools()
      .flatMap((school) => school.grades)
      .filter((grade) => grade.id == gradeId)[0];
  }

  export function getName(gradeId: number): string {
    return getGrade(gradeId).name;
  }

  export function getSchoolId(gradeId: number): number {
    return getSchools().filter((school) =>
      school.grades.some((grade) => grade.id == gradeId)
    )[0].id;
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
}
