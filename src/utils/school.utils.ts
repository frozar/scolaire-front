import {
  AssociatedSchoolType,
  AssociatedStopType,
} from "../_entities/_utils.entity";
import { SchoolType } from "../_entities/school.entity";
import { SchoolService } from "../_services/school.service";
import { addNewUserInformation } from "../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../type";
import { calendars } from "../views/content/calendar/template/Calendar";
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
import {
  schoolDetailsItem,
  setSchoolDetailsItem,
} from "../views/content/schools/component/organism/SchoolDetails";

export namespace SchoolUtils {
  export function get(schoolId: number): SchoolType {
    return getSchools().filter((school) => school.id == schoolId)[0];
  }

  export function getName(schoolId: number) {
    return getSchools().filter((school) => school.id == schoolId)[0].name;
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

  export function isValidSchool(school: SchoolType) {
    let valid = true;
    if (!school.hours) {
      valid = false;
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.error,
        type: MessageTypeEnum.global,
        content:
          "Compléter touts les champs pour définir les plages horraire d'arrivé/départ",
      });
    }

    return valid;
  }

  export async function update(school: SchoolType) {
    const updatedSchool: SchoolType = await SchoolService.update(school);
    const schoolIndex = getSchools().findIndex(
      (item) => item.id == updatedSchool.id
    );
    if (schoolIndex == -1) return;

    setSchools((prev) => {
      if (!prev) return prev;
      const schools = [...prev];
      schools[schoolIndex] = updatedSchool;
      return schools;
    });

    if (schoolDetailsItem()?.id == updatedSchool.id)
      setSchoolDetailsItem(updatedSchool);
  }

  export function linkSchoolToCalendar(calendarId: number) {
    const calendar = calendars()?.find((item) => item.id == calendarId);
    setSchoolDetailsItem((prev) => {
      if (!prev) return prev;
      return { ...prev, calendar: calendar };
    });
  }
}
