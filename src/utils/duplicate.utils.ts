import { createSignal } from "solid-js";
import { useStateGui } from "../StateGui";
import { LocationDBTypeEnum } from "../_entities/_utils.entity";
import { GradeDBType, GradeType } from "../_entities/grade.entity";
import { LineDBType, LineType } from "../_entities/line.entity";
import { TimeUtils } from "../_entities/time.utils";
import { SchoolService } from "../_services/school.service";
import { StopService } from "../_services/stop.service";
import { StudentToGradeService } from "../_services/student-to-grade.service";
import { userMaps } from "../_stores/map.store";
import { disableSpinningWheel, enableSpinningWheel } from "../signaux";
import { CsvEnum } from "../views/content/board/component/molecule/ImportSelection";
import { getLines } from "../views/content/map/component/organism/BusLines";
import {
  getSchools,
  setSchools,
} from "../views/content/map/component/organism/SchoolPoints";
import { setStops } from "../views/content/map/component/organism/StopPoints";
import { fieldToDuplicate } from "../views/content/maps/component/organism/DuplicateDialog";
import { CsvUtils } from "./csv.utils";
import { MapsUtils } from "./maps.utils";
import { SchoolUtils } from "./school.utils";

const [, { getActiveMapId }] = useStateGui();

export const [inDuplication, setInDucplication] = createSignal(false);
export namespace DuplicateUtils {
  async function newMap() {
    const currentMap = userMaps().filter(
      (map) => map.id === getActiveMapId()
    )[0];
    await MapsUtils.createMap({ name: currentMap.name + " (copie)" });
  }

  async function duplicateStopsAndSchoolsWithGradesQuantity() {
    const schoolCSV = CsvUtils.getPointAsCSVFormat(CsvEnum.schools);
    const stopsCSV = CsvUtils.getPointAsCSVFormat(CsvEnum.stops);
    const studentToGradeCSV = CsvUtils.getStudentToGradeAsCSVFormat();

    await newMap();

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
  }

  function duplicateBusLines(lines: LineType[]) {
    // * to duplicate line we need:
    // * - grades
    // * - color
    // * - associated schools
    // * - associated stops
    const newLines: Partial<LineDBType>[] = [];

    console.log("old buslines:", lines);

    // * build interface between last an new grades
    // * {"old": [ {gradeId: 1, name: "grade1"}] }
    // * Like that when i need to retrieve the new ID of the new grade for school i can refer to this interface
    const newGrades: { [school: string]: GradeType[] } = {};
    getSchools().forEach((school) => {
      const grades = school.grades.map((grade) => {
        return {
          ...grade,
          schoolId: SchoolUtils.getIdFromName(school.name),
        };
      });
      newGrades[school.name] = grades;
    });

    function searchGradeByNameInInterface(name: string) {
      let grade: GradeType = {} as GradeType;

      for (const school in newGrades) {
        const grade_ = newGrades[school].filter(
          (grade) => grade.name == name
        )[0];
        if (grade_) {
          grade = grade_;
          break;
        }
      }

      return grade;
    }

    console.log("new grades:", newGrades);

    lines.forEach((line) => {
      const lineGradeNames = line.grades;
      const newLineGrades: GradeDBType[] = [];

      lineGradeNames.forEach((grade) => {
        const grade_ = searchGradeByNameInInterface(grade.name);
        newLineGrades.push({
          id: grade_.id as number,
          name: grade_.name,
          school_id: grade_.schoolId as number,
          hours: TimeUtils.formatHours(grade_.hours),
        });
      });

      const newLine: Partial<LineDBType> = {
        color: line.color(),
        grades: newLineGrades,
        // name: line.name(),
        // schools: line.schools.map((school) => school.name),
        // stops: line.stops.map((stop) => stop.name),
        // trips: line.trips.map((trip) => trip.name),
      };
      newLines.push(newLine);
    });
    console.log("grades of new map:", newGrades);

    console.log("new lines:", newLines);
  }

  export async function duplicate() {
    enableSpinningWheel();
    // * Get current map data
    const oldBuslines = getLines();

    // * Load new school
    await duplicateStopsAndSchoolsWithGradesQuantity();

    console.log("new data loaded");

    if (fieldToDuplicate().lines) {
      duplicateBusLines(oldBuslines);
    }

    setInDucplication(false);
    disableSpinningWheel();
  }
}
