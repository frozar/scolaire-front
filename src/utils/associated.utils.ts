import { AssociatedSchoolType } from "../_entities/_utils.entity";
import { StopType } from "../_entities/stop.entity";
import { StudentToGradeService } from "../_services/student-to-grade.service";
import { getStops } from "../views/content/map/component/organism/StopPoints";
import { stopDetailsItem } from "../views/content/stops/component/organism/StopDetails";
import { GradeUtils } from "./grade.utils";
import { SchoolUtils } from "./school.utils";
import { StopUtils } from "./stop.utils";

// Associated data is redundant. When changes both schools.associated and stop.associated must be updated.
export namespace AssociatedUtils {
  export function get(studentToGradeId: number): AssociatedSchoolType {
    return getStops()
      .flatMap((stop) => stop.associated)
      .filter((assoc) => assoc.idClassToSchool == studentToGradeId)[0];
  }

  export function getStop(studentToGradeId: number): StopType {
    return getStops().filter((stop) =>
      stop.associated.some((assoc) => assoc.idClassToSchool == studentToGradeId)
    )[0];
  }

  export function getStopName(studentToGradeId: number): string {
    return getStop(studentToGradeId).name;
  }

  export function getGradeName(studentToGradeId: number): string {
    const gradeId = get(studentToGradeId).gradeId;

    return GradeUtils.getName(gradeId);
  }

  export function getQuantity(studentToGradeId: number): number {
    return get(studentToGradeId).quantity;
  }

  export async function create(
    quantity: number,
    gradeId: number,
    schoolId: number
  ) {
    const associatedStopT = {
      stopId: Number(stopDetailsItem()?.id),
      quantity,
      gradeId,
    };

    const gradeToSchool = await StudentToGradeService.create(
      associatedStopT,
      schoolId
    );
    StopUtils.addAssociated(gradeToSchool, stopDetailsItem()?.id as number);

    SchoolUtils.addAssociated(gradeToSchool, stopDetailsItem()?.id as number);
  }

  export async function update(
    studentToGradeId: number,
    gradeId: number,
    schoolId: number,
    quantity: number
  ) {
    const stopId = Number(stopDetailsItem()?.id);
    const gradeToSchool = await StudentToGradeService.update(
      {
        idClassToSchool: studentToGradeId,
        stopId,
        quantity,
        gradeId,
      },
      schoolId
    );

    StopUtils.updateAssociated(gradeToSchool, stopId);

    SchoolUtils.updateAssociated(gradeToSchool, stopId);
  }

  export async function deleteAssociated(StudentToGradeId: number) {
    const response = await StudentToGradeService.delete(StudentToGradeId);

    StopUtils.removeAssociated(response, stopDetailsItem()?.id as number);

    SchoolUtils.removeAssociated(StudentToGradeId);
  }
}
