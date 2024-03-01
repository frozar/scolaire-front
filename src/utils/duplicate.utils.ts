import _ from "lodash";
import { createSignal } from "solid-js";
import { useStateGui } from "../StateGui";
import { LocationDBTypeEnum } from "../_entities/_utils.entity";
import { CalendarPeriodType, CalendarType } from "../_entities/calendar.entity";
import { GradeDBType, GradeType } from "../_entities/grade.entity";
import { LineType } from "../_entities/line.entity";
import { PathType } from "../_entities/path.entity";
import { SchoolType } from "../_entities/school.entity";
import { StopType } from "../_entities/stop.entity";
import { TimeUtils } from "../_entities/time.utils";
import { TransporterType } from "../_entities/transporter.entity";
import { TripDBType, TripEntity } from "../_entities/trip.entity";
import { AllotmentService } from "../_services/allotment.service";
import { BusService } from "../_services/bus.service";
import { CalendarService } from "../_services/calendar.service";
import { BusLineService } from "../_services/line.service";
import { PathService } from "../_services/path.service";
import { SchoolService } from "../_services/school.service";
import { StopService } from "../_services/stop.service";
import { StudentToGradeService } from "../_services/student-to-grade.service";
import { TransporterService } from "../_services/transporter.service";
import { userMaps } from "../_stores/map.store";
import { disableSpinningWheel, enableSpinningWheel } from "../signaux";
import { NatureEnum } from "../type";
import {
  getAllTransporter,
  setAllTransporter,
} from "../views/content/allotment/molecule/TransporterTable";
import {
  AllotmentType,
  getAllotment,
  setAllotment,
} from "../views/content/allotment/organism/Allotment";
import { CsvEnum } from "../views/content/board/component/molecule/ImportSelection";
import {
  BusCategoryType,
  getBus,
  setBus,
} from "../views/content/bus/organism/Bus";
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
import {
  getStops,
  setStops,
} from "../views/content/map/component/organism/StopPoints";
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
  paths: PathType[];
};
export namespace DuplicateUtils {
  async function newMap() {
    const currentMap = userMaps().filter(
      (map) => map.id === getActiveMapId()
    )[0];
    await MapsUtils.createMap({
      name: currentMap.name + " (copie)",
      bounding_box: currentMap.bounding_box,
    });
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

  const newGradesInterface: { [school: string]: GradeType[] } = {};

  /**
   * * build interface between last an new grades
   * * {"school_name": [ {gradeId: 1, name: "grade1"}] }
   * * Like that when i need to retrieve the new ID of the new grade for school i can refer to this interface
   */
  function createOldAndNewGradesInterface() {
    getSchools().forEach((school) => {
      const grades = school.grades.map((grade) => {
        return {
          ...grade,
          schoolId: SchoolUtils.getIdFromName(school.name),
        };
      });
      newGradesInterface[school.name] = grades;
    });
  }

  function searchGradeByNameInInterface(name: string) {
    let grade: GradeType = {} as GradeType;

    for (const school in newGradesInterface) {
      const grade_ = newGradesInterface[school].filter(
        (grade) => grade.name == name
      )[0];
      if (grade_) {
        grade = grade_;
        break;
      }
    }

    return grade;
  }

  async function duplicateBusLines(
    lines: LineType[],
    oldSchools: SchoolType[],
    oldStops: StopType[],
    oldAllotments: AllotmentType[],
    oldBusCategories: BusCategoryType[]
  ) {
    const newLines: BusLineImportFormat[] = [];

    function searchGradeByIdInOldSchools(id: number) {
      let grade: GradeType = {} as GradeType;

      for (const school of oldSchools) {
        const grade_ = school.grades.filter((grade) => grade.id == id)[0];
        if (grade_) {
          grade = grade_;
          break;
        }
      }

      return grade;
    }
    createOldAndNewGradesInterface();

    // * new grades attributions to line
    lines.forEach((line) => {
      const lineGradeNames = line.grades;
      const newLineGrades: GradeDBType[] = [];

      // * Define grade with new grade ids
      lineGradeNames.forEach((grade) => {
        const grade_ = searchGradeByNameInInterface(grade.name);
        newLineGrades.push({
          id: grade_.id as number,
          name: grade_.name,
          school_id: grade_.schoolId as number,
          hours: TimeUtils.formatHours(grade_.hours),
        });
      });

      // * duplicate path
      if (fieldToDuplicate().paths) {
        line.paths.forEach((path) => {
          const schoolNames: string[] = [];

          path.schools = path.schools.map((school) => {
            const school_ = oldSchools.filter(
              (oldSchool) => oldSchool.id === school
            )[0];

            schoolNames.push(school_.name);
            return SchoolUtils.getIdFromName(school_.name);
          });

          path.grades = path.grades.map((grade) => {
            const grade_ = searchGradeByIdInOldSchools(grade);
            return searchGradeByNameInInterface(grade_.name).id as number;
          });

          path.points = path.points.map((point) => {
            if (point.nature == NatureEnum.stop) {
              const oldPoint = oldStops.filter(
                (oldStop) => oldStop.id === point.id
              )[0];

              const currentStop = getStops().filter(
                (stop) => stop.name === oldPoint.name
              )[0];

              return currentStop;
            } else {
              const oldSchool = oldSchools.filter(
                (oldSchool) => oldSchool.id === point.id
              )[0];
              const currentSchool = getSchools().filter(
                (stop) => stop.name === oldSchool.name
              )[0];

              return currentSchool;
            }
          });
        });
      }

      // * duplicate trips
      if (fieldToDuplicate().trips) {
        console.log("trips before process:", line.trips);

        line.trips.forEach((trip) => {
          const allotmentIndex = oldAllotments.findIndex(
            (allo) => allo.id === trip.allotmentId
          );
          const busCategoryIndex = oldBusCategories.findIndex(
            (category) => category.id === trip.busCategoriesId
          );

          trip.allotmentId = getAllotment()[allotmentIndex].id;
          trip.busCategoriesId = getBus()[busCategoryIndex].id;

          // ! TODO: schools, waypoints, tripPoints
          trip.busCategoriesId;
          trip.schools = trip.schools.map((school) => {
            school.id = SchoolUtils.getIdFromName(school.name);
            return school;
          });

          trip.tripPoints = trip.tripPoints.map((point) => {
            if (point.nature == NatureEnum.school)
              point.id = SchoolUtils.getIdFromName(point.name);
            else point.id = StopUtils.getStopFromName(point.name).id;
            return point;
          });

          trip.waypoints = trip.waypoints?.map((point) => {
            console.log("waypoint process:", point.idSchool, point.idStop);

            if (point.idSchool && point.idSchool != 0) {
              console.log("old school:", oldSchools);
              console.log("new school:", getSchools());

              console.log("school waypoint process:", point.idSchool);

              const schoolIndex = oldSchools.findIndex(
                (school) => school.id == point.idSchool
              );

              console.log("school index:", schoolIndex);

              point.idSchool = getSchools()[schoolIndex].id;
            }

            if (point.idStop && point.idStop != 0) {
              const stopIndex = oldStops.findIndex(
                (stop) => stop.id == point.idStop
              );
              point.idStop = getStops()[stopIndex].id;
            }
            return point;
          });

          // * for the bug, potentially here to look (not sure)
          trip.grades = trip.grades.map((grade) => {
            const grade_ = searchGradeByIdInOldSchools(grade.id as number);
            return searchGradeByNameInInterface(grade_.name);
          });
        });

        console.log("trips after process:", line.trips);
      }

      // const trips = line.trips;
      // ! TODO process trips stop to redefine all stops id
      // ! same for school id

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
        paths: line.paths,
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

  export async function duplicateBusCategories(
    oldBusCategory: BusCategoryType[]
  ) {
    const busCategories = await BusService.importBus(oldBusCategory);
    setBus(busCategories);
  }

  export async function duplicateTransporters(
    oldTransporters: TransporterType[],
    oldAllotments: AllotmentType[],
    oldBusCategories: BusCategoryType[]
  ) {
    oldTransporters.forEach((transporter) => {
      const allotmentIndex = oldAllotments.findIndex(
        (allotment) => allotment.id == transporter.allotment_id
      );
      transporter.allotment_id = getAllotment()[allotmentIndex].id;

      transporter.vehicles.forEach((vehicle) => {
        const vehicleIndex = oldBusCategories.findIndex(
          (category) => category.id == vehicle.bus_categories_id
        );
        vehicle.bus_categories_id = getBus()[vehicleIndex].id;
      });
    });

    const transporter = await TransporterService.importTransporters(
      oldTransporters
    );

    setAllTransporter(transporter);
  }

  export function duplcatePaths(paths: PathType[]) {
    const importedPaths = PathService.importPaths(paths);
    console.log("imported paths: ", importedPaths);
  }

  export async function duplicate() {
    enableSpinningWheel();
    // * Get current map data
    const oldSchools = _.cloneDeep(getSchools());
    const oldStops = _.cloneDeep(getStops());
    const oldBuslines = _.cloneDeep(getLines());
    const oldCalendars = _.cloneDeep(calendars());
    const oldCalendarPeriod = _.cloneDeep(calendarsPeriod());
    const oldAllotments = _.cloneDeep(getAllotment());
    const oldTransporters = _.cloneDeep(getAllTransporter());
    const oldBusCategories = _.cloneDeep(getBus());

    console.log("first old school:", oldSchools);

    // * Load new school
    await duplicateStopsAndSchoolsWithGradesQuantity();

    // ! TODO before duplicate line trips
    // ! need to duplicate:
    // ! - paths
    // ! - allotments ~OK
    // ! - bus categories
    // ! - calendar OK
    if (fieldToDuplicate().busCategories)
      await duplicateBusCategories(oldBusCategories);
    if (fieldToDuplicate().allotments) await duplicateAllotment(oldAllotments);
    if (fieldToDuplicate().transporters)
      await duplicateTransporters(
        oldTransporters,
        oldAllotments,
        oldBusCategories
      );

    if (fieldToDuplicate().calendarPeriod)
      await duplicateCalendarPeriod(oldCalendarPeriod);
    if (fieldToDuplicate().calendar)
      await duplicateCalendar(oldCalendars, oldCalendarPeriod);

    console.log("secoind old school:", oldSchools);

    if (fieldToDuplicate().lines)
      await duplicateBusLines(
        oldBuslines,
        oldSchools,
        oldStops,
        oldAllotments,
        oldBusCategories
      );

    console.log("disablez spenning wheel");

    setInDucplication(false);
    disableSpinningWheel();
  }
}
