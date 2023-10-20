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
}
