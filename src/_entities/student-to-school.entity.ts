import { AssociatedStopType } from "./_utils.entity";

export namespace ClassStudentToGradeEntity {
  export function dbFormat(
    gradeStudentToGrade: Omit<AssociatedStopType, "idClassToSchool">,
    schoolId: number
  ): Omit<ClassToSchoolDBType, "id"> {
    return {
      school_id: schoolId,
      stop_id: gradeStudentToGrade.stopId as number,
      quantity: gradeStudentToGrade.quantity,
      grade_id: gradeStudentToGrade.gradeId,
    };
  }
}

export type ClassToSchoolDBType = {
  id: number;
  stop_id: number;
  school_id: number;
  quantity: number;
  grade_id: number;
};

export type CSVFormatStudentToGrade = {
  quantity: 4;
  school_name: string;
  stop_name: string;
};
