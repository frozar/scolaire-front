import { StudentToGradeService } from "../_services/student-to-grade.service";
import { appendToStop } from "../views/content/map/component/organism/StopPoints";
import { stopDetailsItem } from "../views/content/stops/component/organism/StopDetails";
import { SchoolUtils } from "./school.utils";

export namespace AssociatedUtils {
  export async function create(
    quantity: number,
    gradeId: number,
    schoolId: number
  ) {
    // TODO to fix
    const associatedStopT = {
      stopId: Number(stopDetailsItem()?.id),
      quantity,
      gradeId,
    };

    const gradeToSchool = await StudentToGradeService.create(
      associatedStopT,
      schoolId
    );
    appendToStop(gradeToSchool, stopDetailsItem()?.id as number);

    SchoolUtils.addGradeToSchool(
      gradeToSchool,
      stopDetailsItem()?.id as number
    );
  }

  // TODO
  export async function update() {
    // const gradeToSchool = await StudentToGradeService.update({
    //   idClassToSchool: props.gradeStudentToGrade?.idClassToSchool as number,
    //   schoolId: Number(schoolSelectRef().value),
    //   stopId: Number(stopDetailsItem()?.id),
    //   quantity: Number(quantityInputRef().value),
    //   gradeId: Number(gradeSelectRef().value),
    // });

    // updateFromStop(gradeToSchool, stopDetailsItem()?.id as number);

    // TODO lucas même update mais pour school
    console.log("update student to grade");
  }
}
