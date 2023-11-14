import { StudentToGradeService } from "../_services/student-to-grade.service";
import { stopDetailsItem } from "../views/content/stops/component/organism/StopDetails";
import { SchoolUtils } from "./school.utils";
import { StopUtils } from "./stop.utils";

// Associated data is redundant. When changes both schools.associated and stop.associated must be updated.
export namespace AssociatedUtils {
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

  // TODO
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
