import { AssociatedSchoolType } from "../_entities/_utils.entity";
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
  export function getName(schoolId: number) {
    return getSchools().filter((school) => school.id == schoolId)[0].name;
  }

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

  export function getRemainingQuantity(schoolId: number) {
    let remainingQuantity = getTotalQuantity(schoolId);
    const school = getSchools().filter((school) => school.id == schoolId)[0];
    const gradeIds = school.grades.map((grade) => grade.id as number);

    getLines()
      .flatMap((line) => line.trips)
      .flatMap((trip) => trip.tripPoints)
      .flatMap((tripPoint) => tripPoint.grades)
      .forEach((grade) => {
        if (gradeIds.includes(grade.gradeId))
          remainingQuantity -= grade.quantity;
      });

    return remainingQuantity;
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
