import { StudentToSchool } from "../_services/student-to-school.service";
import { ClasseType } from "./classe.entity";

export namespace ClassStudentToSchool {
  export function build(
    dbData: ClassStudentToSchoolTypeFormated
  ): StudentToSchool {
    return {
      id: dbData.id,
      quantity: dbData.quantity,
      stop_name: dbData.stop.name,
      school_name: dbData.school.name,
      class_name: dbData.class.name,
    };
  }

  export function dbFormat(
    classStudentToSchool: ClassStudentToSchoolDBType
  ): ClassStudentToSchoolType {
    return {
      id: classStudentToSchool.id,
      stopId: classStudentToSchool.stop_id,
      schoolId: classStudentToSchool.school_id,
      quantity: classStudentToSchool.quantity,
      classId: classStudentToSchool.class_id,
    };
  }
}

type ClassStudentToSchoolTypeFormated = {
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
