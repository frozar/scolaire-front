import { createSignal } from "solid-js";
import { useStateGui } from "../StateGui";
import { LocationDBTypeEnum } from "../_entities/_utils.entity";
import { CalendarPeriodType, CalendarType } from "../_entities/calendar.entity";
import { GradeDBType, GradeType } from "../_entities/grade.entity";
import { LineType } from "../_entities/line.entity";
import { TimeUtils } from "../_entities/time.utils";
import { TransporterType } from "../_entities/transporter.entity";
import { TripDBType, TripEntity } from "../_entities/trip.entity";
import { AllotmentService } from "../_services/allotment.service";
import { CalendarService } from "../_services/calendar.service";
import { BusLineService } from "../_services/line.service";
import { SchoolService } from "../_services/school.service";
import { StopService } from "../_services/stop.service";
import { StudentToGradeService } from "../_services/student-to-grade.service";
import { userMaps } from "../_stores/map.store";
import { disableSpinningWheel, enableSpinningWheel } from "../signaux";
import { getAllTransporter } from "../views/content/allotment/molecule/TransporterTable";
import {
  AllotmentType,
  getAllotment,
  setAllotment,
} from "../views/content/allotment/organism/Allotment";
import { CsvEnum } from "../views/content/board/component/molecule/ImportSelection";
import {
  calendars,
  setCalendars,
} from "../views/content/calendar/calendar.manager";
import {
  calendarsPeriod,
  setCalendarsPeriod,
} from "../views/content/calendar/template/Calendar";
import {
  getLines,
  setLines,
} from "../views/content/map/component/organism/BusLines";
import {
  getSchools,
  setSchools,
} from "../views/content/map/component/organism/SchoolPoints";
import { setStops } from "../views/content/map/component/organism/StopPoints";
import { fieldToDuplicate } from "../views/content/maps/component/organism/DuplicateDialog";
import { CsvUtils } from "./csv.utils";
import { MapsUtils } from "./maps.utils";
import { SchoolUtils } from "./school.utils";
import { StopUtils } from "./stop.utils";

const [, { getActiveMapId }] = useStateGui();

export const [inDuplication, setInDucplication] = createSignal(false);

export type BusLineImportFormat = {
  name: string;
  color: string;
  grades: number[];
  schools: number[];
  stops: number[];
  trips: TripDBType[];
};
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

  async function duplicateBusLines(lines: LineType[]) {
    // * to duplicate line we need:
    // * - grades
    // * - color
    // * - associated schools
    // * - associated stops
    const newLines: BusLineImportFormat[] = [];

    console.log("old buslines:", lines);

    // * build interface between last an new grades
    // * {"school_name": [ {gradeId: 1, name: "grade1"}] }
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

      // const trips = line.trips;
      // ! TODO process trips stop to redefine all stops id
      // ! same for school id

      // trips.forEach(trip => {
      //   trip.
      // })

      const newLine: BusLineImportFormat = {
        color: line.color().substring(1),
        grades: newLineGrades.map((grade) => grade.id),
        name: line.name as string,
        stops: line.stops.map(
          (stop) => StopUtils.getStopFromName(stop.name).id
        ),
        schools: line.schools.map((school) =>
          SchoolUtils.getIdFromName(school.name)
        ),
        trips: line.trips.map(
          (trip) => TripEntity.dbPartialFormat(trip) as TripDBType
        ),
      };

      console.log("new line:", newLine);

      newLines.push(newLine);
    });

    const lines_ = await BusLineService.import(newLines);
    setLines(lines_);
  }

  export async function duplicateCalendarPeriod(
    calendars: CalendarPeriodType[]
  ) {
    const calendarPeriods = await CalendarService.importCalendarPeriod(
      calendars
    );
    setCalendarsPeriod(calendarPeriods);
  }

  export async function duplicateCalendar(
    calendars: CalendarType[],
    oldCalendarPeriods: CalendarPeriodType[]
  ) {
    calendars.forEach((calendar) => {
      const calendarPeriodIndex = oldCalendarPeriods.findIndex(
        (calendarPeriod) => calendarPeriod.id == calendar.calendarPeriodId
      );

      const newCalendarPeriod = calendarsPeriod()[calendarPeriodIndex];
      calendar.calendarPeriodId = newCalendarPeriod.id;
    });

    const calendars_ = await CalendarService.importCalendar(calendars);
    setCalendars(calendars_);
  }

  export async function duplicateAllotment(oldAllotments: AllotmentType[]) {
    const allotments = await AllotmentService.importAllotments(oldAllotments);
    setAllotment(allotments);
  }

  export function duplicateTransporters(oldTransporters: TransporterType[]) {
    console.log("old transporter: ", oldTransporters);

    // const transporter = await TransporterService;.
  }

  export async function duplicate() {
    enableSpinningWheel();
    // * Get current map data
    const oldBuslines = getLines();
    const oldCalendars = calendars();
    const oldCalendarPeriod = calendarsPeriod();
    const oldAllotments = getAllotment();
    const oldTransporters = getAllTransporter();

    // * Load new school
    await duplicateStopsAndSchoolsWithGradesQuantity();

    // ! TODO before duplicate line trips
    // ! need to duplicate:
    // ! - paths
    // ! - allotments
    // ! - calendar OK
    // ! - bus categories

    duplicateTransporters(oldTransporters);
    if (fieldToDuplicate().allotments) await duplicateAllotment(oldAllotments);

    if (fieldToDuplicate().calendarPeriod)
      await duplicateCalendarPeriod(oldCalendarPeriod);
    if (fieldToDuplicate().calendar)
      await duplicateCalendar(oldCalendars, oldCalendarPeriod);

    if (fieldToDuplicate().lines) duplicateBusLines(oldBuslines);

    setInDucplication(false);
    disableSpinningWheel();
  }
}
