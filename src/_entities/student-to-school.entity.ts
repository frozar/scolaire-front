import { AssociatedStopType } from "./_utils.entity";

export namespace ClassStudentToSchoolEntity {
  export function dbFormat(
    classStudentToSchool: Omit<AssociatedStopType, "idClassToSchool">,
    schoolId: number
  ): Omit<ClassToSchoolDBType, "id"> {
    return {
      school_id: schoolId,
      stop_id: classStudentToSchool.stopId as number,
      quantity: classStudentToSchool.quantity,
      class_id: classStudentToSchool.classId,
    };
  }
}

export type ClassToSchoolDBType = {
  id: number;
  stop_id: number;
  school_id: number;
  quantity: number;
  class_id: number;
};

export type CSVFormatStudentToSchool = {
  quantity: 4;
  school_name: string;
  stop_name: string;
};
