import { AssociatedSchoolType } from "../_entities/_utils.entity";
import { SchoolType } from "../_entities/school.entity";
import { SchoolService } from "../_services/school.service";
import {
  getLines,
  setLines,
} from "../views/content/map/component/organism/BusLines";
import {
  getSchools,
  setSchools,
} from "../views/content/map/component/organism/SchoolPoints";
import {
  getStops,
  setStops,
} from "../views/content/map/component/organism/StopPoints";

export namespace SchoolUtils {
  export async function DeleteSchool(schoolId: number) {
    const id_school: number = await SchoolService.delete(schoolId);

    const deletedSchool = getSchools().filter(
      (school) => school.id == id_school
    );

    const deletedGrades = deletedSchool
      .map((school) => school.grades.flatMap((grade) => grade.id as number))
      .flat();

    const newStops = getStops().map((stop) => {
      return {
        ...stop,
        associated: stop.associated.filter((grade) =>
          deletedGrades.includes(grade.gradeId)
        ),
      };
    });

    setStops(newStops);

    const newLines = getLines().map((line) => {
      return {
        ...line,
        schools: line.schools.filter((school) => school.id != id_school),
        trips: line.trips.filter(
          (trip) => !trip.schools.map((school) => school.id).includes(id_school)
        ),
      };
    });

    setLines(newLines);

    setSchools(getSchools().filter((school) => school.id != id_school));

    if (!id_school) return false;
    return true;
  }

  export function getTotalQuantity(schoolId: number) {
    let quantity = 0;
    getStops()
      .flatMap((stop) => stop.associated)
      .forEach((assoc) => {
        if (assoc.schoolId == schoolId) quantity += assoc.quantity;
      });

    return quantity;
  }

  // TODO: Refactor (use getTotalQuantity)
  export function getRemainingQuantity(school: SchoolType) {
    // Sum all grades qty link to this school
    const remainingQty: { [gradeId: number]: number } = {};
    school.associated.map((assoc) => {
      if (!remainingQty[assoc.gradeId]) {
        remainingQty[assoc.gradeId] = assoc.quantity;
      } else {
        remainingQty[assoc.gradeId] += assoc.quantity;
      }
    });
    // Update remainingQty with grade qty in trips
    getLines()
      .flatMap((line) => line.trips.flatMap((trip) => trip.tripPoints))
      .flatMap((tripPoint) => tripPoint.grades)
      .forEach((gradeTrip) => {
        if (remainingQty[gradeTrip.gradeId]) {
          remainingQty[gradeTrip.gradeId] -= gradeTrip.quantity;
        }
      });

    // Sum remaining qtys
    let totalRemainingQty = 0;
    Object.entries(remainingQty).forEach((key) => {
      totalRemainingQty += key[1];
    });

    return totalRemainingQty;
  }

  export function addGradeToSchool(
    gradeToSchool: AssociatedSchoolType,
    stopId: number
  ) {
    setSchools((prev) => {
      const newSchools = [...prev];
      newSchools
        .filter((school) => school.id == gradeToSchool.schoolId)[0]
        .associated.push({
          idClassToSchool: gradeToSchool.idClassToSchool,
          stopId,
          quantity: gradeToSchool.quantity,
          gradeId: gradeToSchool.gradeId,
        });
      return newSchools;
    });
  }
}
