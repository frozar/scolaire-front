import { StudentToSchool } from "../_services/student-to-school.service";

type StudentToSchoolDBData = {
  id: number;
  quantity: number;
  class: {
    name: string;
  };
  school: {
    name: string;
  };
  stop: {
    name: string;
  };
};

export namespace ClassStudentToSchool {
  export function build(dbData: StudentToSchoolDBData): StudentToSchool {
    return {
      id: dbData.id,
      quantity: dbData.quantity,
      stop_name: dbData.stop.name,
      school_name: dbData.school.name,
      class_name: dbData.class.name,
    };
  }
}
