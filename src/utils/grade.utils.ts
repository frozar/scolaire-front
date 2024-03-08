import { GradeType } from "../_entities/grade.entity";
import {
  TripDirectionEntity,
  TripDirectionEnum,
} from "../_entities/trip-direction.entity";
import { GradeService } from "../_services/grade.service";
import { getLines } from "../_stores/line.store";
import { getSchools, setSchools } from "../_stores/school.store";
import { getStops } from "../_stores/stop.store";
import {
  schoolDetails,
  setSchoolDetails,
} from "../views/content/schools/component/template/SchoolDetails";

export namespace GradeUtils {
  export function getGrade(gradeId: number): GradeType {
    const grade: GradeType[] = [];
    getSchools().forEach((school) => {
      const grade_ = school.grades.filter((grade) => grade.id == gradeId)[0];
      if (grade_) {
        if (!grade_?.calendar) grade_.calendar = school.calendar;
        grade.push(grade_);
      }
    });
    return grade[0];
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

  export function checkIfIsUsed(gradeId: number): boolean {
    if (GradeUtils.getTotalQuantity(gradeId) > 0) {
      return true;
    } else return false;
  }

  export async function deleteGrade(gradeId: number): Promise<boolean> {
    const deletedGradeId = await GradeService.delete(gradeId);
    if (!deletedGradeId) return false;

    if (deletedGradeId) {
      // eslint-disable-next-line solid/reactivity
      setSchools((prev) => {
        return [...prev].map((school) => {
          return {
            ...school,
            grades: school.grades.filter((grade) => grade.id != gradeId),
          };
        });
      });
      const schoolDetailsItemId = schoolDetails()?.id as number;
      setSchoolDetails(
        getSchools().filter((school) => school.id == schoolDetailsItemId)[0]
      );
    }
    return true;
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
