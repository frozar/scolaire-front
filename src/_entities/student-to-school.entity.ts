import { AssociatedStopType } from "./_utils.entity";

export namespace StudentToGradeEntity {
  export function dbFormat(
    associatedStop: Omit<AssociatedStopType, "idClassToSchool">,
    schoolId: number
  ): Omit<ClassToSchoolDBType, "id"> {
    return {
      school_id: schoolId,
      stop_id: associatedStop.stopId as number,
      quantity: associatedStop.quantity,
      grade_id: associatedStop.gradeId,
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
