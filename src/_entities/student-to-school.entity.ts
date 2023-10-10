import { ClasseType } from "./classe.entity";

export namespace ClassStudentToSchool {
  export function dbFormat(
    classStudentToSchool: Omit<ClassStudentToSchoolType, "id">
  ): Omit<ClassStudentToSchoolDBType, "id"> {
    return {
      stop_id: classStudentToSchool.stopId,
      school_id: classStudentToSchool.schoolId,
      quantity: classStudentToSchool.quantity,
      class_id: classStudentToSchool.classId,
    };
  }
}

export type ClassStudentToSchoolTypeFormated = {
  id: number;
  quantity: number;
  class: Omit<
    ClasseType,
    "afternoonStart" | "afternoonStart" | "morningEnd" | "morningStart"
  >;
  school: {
    id?: number;
    name: string;
  };
  stop: {
    id?: number;
    name: string;
  };
};

export type ClassStudentToSchoolDBType = {
  id: number;
  stop_id: number;
  school_id: number;
  quantity: number;
  class_id: number;
};

export type ClassStudentToSchoolType = {
  id: number;
  stopId: number;
  schoolId: number;
  quantity: number;
  classId: number;
};

export type CSVFormatStudentToSchool = {
  quantity: 4;
  school_name: string;
  stop_name: string;
};
