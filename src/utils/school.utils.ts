import {
  AssociatedSchoolType,
  AssociatedStopType,
} from "../_entities/_utils.entity";
import { GradeType } from "../_entities/grade.entity";
import { SchoolType } from "../_entities/school.entity";
import { SchoolService } from "../_services/school.service";
import { getSchools, setSchools } from "../_stores/school.store";
import { StopStore, getStops } from "../_stores/stop.store";
import { addNewUserInformation } from "../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../type";
import { calendars } from "../views/content/calendar/calendar.manager";
import {
  getLines,
  setLines,
} from "../views/content/map/component/organism/BusLines";
import { setSchoolDetailsItem } from "../views/content/schools/component/organism/SchoolDetails";
import { QuantityUtils } from "./quantity.utils";

export namespace SchoolUtils {
  export function get(schoolId: number): SchoolType {
    return getSchools().filter((school) => school.id == schoolId)[0];
  }

  export function getName(schoolId: number) {
    return getSchools().filter((school) => school.id == schoolId)[0].name;
  }

  export function getGrades(schoolId: number | undefined): GradeType[] {
    const school = getSchools().find((school) => school.id == schoolId);
    if (!school) return [];
    school.grades.map((grade) => {
      if (!grade.calendar) grade.calendar = school.calendar;
      return grade;
    });
    return school.grades;
  }

  // Carefull, here schoolName is used as an identitifer
  export function getIdFromName(schoolName: string): number {
    return getSchools().filter((school) => school.name == schoolName)[0].id;
  }

  export async function DeleteSchool(schoolId: number) {
    const id_school: number = await SchoolService.delete(schoolId);

    const deletedSchool = getSchools().filter(
      (school) => school.id == id_school
    );

    const deletedGrades = deletedSchool
      .map((school) => school.grades.flatMap((grade) => grade.id as number))
      .flat();

    //TODO déplacer dans store ?
    const newStops = getStops().map((stop) => {
      return {
        ...stop,
        associated: stop.associated.filter((grade) =>
          deletedGrades.includes(grade.gradeId)
        ),
      };
    });

    StopStore.set(newStops);

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

  function removeDuplicateNumber(data: number[]) {
    return [...new Set(data)];
  }

  export function hasRemainingStudentToGet(
    schoolId: number
  ): [boolean, boolean] {
    const school = getSchools().filter((school) => school.id == schoolId)[0];
    const stopIds = school.associated.map((associated) => associated.stopId);
    const tuples: [boolean, boolean][] = [];

    // * Here for each stop i get a tuple of the remaining quantity for going & coming direction
    removeDuplicateNumber(stopIds).forEach((id) => {
      tuples.push(
        QuantityUtils.stopHasRemainingStudentToGet(id, true) as [
          boolean,
          boolean
        ]
      );
    });

    // * Check if first item of the tuple have de same value of all the other tuples first item
    const allEqual = (arr: [boolean, boolean][], tupleIndex: number) =>
      arr.every((v) => v[tupleIndex] === arr[0][tupleIndex]);

    /**
     ** Informations:
     ** [[false, false], [true, false]] => false, true
     ** [[true, false], [true, false]] => true, true
     ** [[false, true], [true, false]] => false, false
     ** the next code will teste the first col & second col of each tuple
     */
    const allEqualGoing = allEqual(tuples, 0);
    const allEqualComing = allEqual(tuples, 1);

    if (allEqualGoing && allEqualComing) {
      if (tuples[0][0] != tuples[0][1]) return [tuples[0][0], tuples[0][1]];
      return tuples[0][0] ? [true, true] : [false, false];
    } else return [true, false];
  }

  export function addAssociated(
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

  export function removeAssociated(studentToGradeId: number) {
    setSchools((prev) => {
      const schools: SchoolType[] = [...prev].map((school) => {
        return {
          ...school,
          associated: school.associated.filter(
            (assoc) => assoc.idClassToSchool != studentToGradeId
          ),
        };
      });

      return schools;
    });
  }

  export function updateAssociated(
    associated: AssociatedSchoolType,
    stopId: number
  ) {
    setSchools((prev) => {
      const schools: SchoolType[] = [...prev].map((school) => {
        return {
          ...school,
          associated: school.associated.map((assoc) =>
            assoc.idClassToSchool == associated.idClassToSchool
              ? ({
                  idClassToSchool: associated.idClassToSchool,
                  stopId: stopId,
                  quantity: associated.quantity,
                  gradeId: associated.gradeId,
                } as AssociatedStopType)
              : assoc
          ),
        };
      });

      return schools;
    });
  }

  export function isValidSchool(school: SchoolType): boolean {
    if (
      !school.hours.startHourComing ||
      !school.hours.startHourGoing ||
      !school.hours.endHourComing ||
      !school.hours.endHourGoing
    ) {
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.error,
        type: MessageTypeEnum.global,
        content: "Compléter touts les champs",
      });
      return false;
    }
    return true;
  }

  export function linkSchoolToCalendar(calendarId: number) {
    const calendar = calendars()?.find((item) => item.id == calendarId);
    setSchoolDetailsItem((prev) => {
      if (!prev) return prev;
      return { ...prev, calendar: calendar };
    });
  }

  export function updateSchoolDetails(school: Partial<SchoolType>) {
    setSchoolDetailsItem((prev) => {
      if (!prev) return prev;
      return { ...prev, ...school };
    });
  }
}
