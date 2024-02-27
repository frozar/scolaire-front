import { createSignal } from "solid-js";
import { LocationDBTypeEnum } from "../_entities/_utils.entity";
import { SchoolService } from "../_services/school.service";
import { StopService } from "../_services/stop.service";
import { StudentToGradeService } from "../_services/student-to-grade.service";
import { disableSpinningWheel, enableSpinningWheel } from "../signaux";
import { CsvEnum } from "../views/content/board/component/molecule/ImportSelection";
import { setSchools } from "../views/content/map/component/organism/SchoolPoints";
import { setStops } from "../views/content/map/component/organism/StopPoints";
import { CsvUtils } from "./csv.utils";
import { MapsUtils } from "./maps.utils";

export const [inDuplication, setInDucplication] = createSignal(false);
export namespace DuplicateUtils {
  export async function duplicate() {
    enableSpinningWheel();
    setInDucplication(true);
    const schoolCSV = CsvUtils.getPointAsCSVFormat(CsvEnum.schools);
    const stopsCSV = CsvUtils.getPointAsCSVFormat(CsvEnum.stops);
    const studentToGradeCSV = CsvUtils.getStudentToGradeAsCSVFormat();

    await MapsUtils.createMap({ name: "Duplicated" });

    const newSchools = await SchoolService.import({
      items_to_add: schoolCSV.map((school) => {
        return {
          location: {
            data: {
              lat: school.lat,
              lng: school.lon,
            },
            type: LocationDBTypeEnum.point,
          },
          name: school.name,
        };
      }),
      items_to_delete: [],
      items_to_modify: [],
    });

    setSchools(newSchools);

    const newStops = await StopService.import({
      items_to_add: stopsCSV.map((school) => {
        return {
          location: {
            data: {
              lat: school.lat,
              lng: school.lon,
            },
            type: LocationDBTypeEnum.point,
          },
          name: school.name,
        };
      }),
      items_to_delete: [],
      items_to_modify: [],
    });
    setStops(newStops);

    const grades: { gradeName: string; schoolName: string }[] = [];

    studentToGradeCSV.forEach((studentToGrade) => {
      const gradeNames = grades.map((grade) => grade.gradeName);

      if (!gradeNames.includes(studentToGrade.grade_name))
        grades.push({
          gradeName: studentToGrade.grade_name,
          schoolName: studentToGrade.school_name,
        });
    });

    await StudentToGradeService.importStudents({
      added: studentToGradeCSV,
      deleted: [],
      modified: [],
      newGrades: grades,
    });
    disableSpinningWheel();
  }
}
