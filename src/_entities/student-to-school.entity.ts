import { AssociatedStopType } from "./_utils.entity";

export namespace ClassStudentToSchoolEntity {
  export function dbFormat(
    gradeStudentToSchool: Omit<AssociatedStopType, "idClassToSchool">,
    schoolId: number
  ): Omit<ClassToSchoolDBType, "id"> {
    return {
      school_id: schoolId,
      stop_id: gradeStudentToSchool.stopId as number,
      quantity: gradeStudentToSchool.quantity,
      grade_id: gradeStudentToSchool.gradeId,
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

export type CSVFormatStudentToSchool = {
  quantity: 4;
  school_name: string;
  stop_name: string;
};
