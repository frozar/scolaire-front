import { AssociatedSchoolType } from "../_entities/_utils.entity";
import { StopType } from "../_entities/stop.entity";
import { StudentToGradeService } from "../_services/student-to-grade.service";
import { getStops } from "../_stores/stop.store";
import { disableSpinningWheel, enableSpinningWheel } from "../signaux";
import { stopDetails } from "../views/content/stops/component/template/StopDetails";
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
      stopId: Number(stopDetails()?.id),
      quantity,
      gradeId,
    };

    const gradeToSchool = await StudentToGradeService.create(
      associatedStopT,
      schoolId
    );
    StopUtils.addAssociated(gradeToSchool, stopDetails()?.id as number);

    SchoolUtils.addAssociated(gradeToSchool, stopDetails()?.id as number);
  }

  export async function update(
    studentToGradeId: number,
    gradeId: number,
    schoolId: number,
    quantity: number
  ) {
    const stopId = Number(stopDetails()?.id);
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
    enableSpinningWheel();
    const response = await StudentToGradeService.delete(StudentToGradeId);
    disableSpinningWheel();

    StopUtils.removeAssociated(response, stopDetails()?.id as number);
    SchoolUtils.removeAssociated(StudentToGradeId);
  }
}
