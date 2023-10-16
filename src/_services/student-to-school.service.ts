import {
  AssociatedDBPointType,
  AssociatedSchoolType,
  EntityUtils,
} from "../_entities/_utils.entity";
import {
  SchoolDBType,
  SchoolEntity,
  SchoolType,
} from "../_entities/school.entity";
import { StopDBType, StopEntity, StopType } from "../_entities/stop.entity";
import { ClassStudentToSchoolEntity } from "../_entities/student-to-school.entity";
import { ServiceUtils } from "./_utils.service";

export type StudentToSchool = {
  id: number;
  school_name: string;
  stop_name: string;
  class_name: string;
  quantity: number;
};

export class StudentToSchoolService {
  static async import(
    students_to_schools: StudentToSchool[]
  ): Promise<{ schools: SchoolType[]; stops: StopType[] }> {
    const xanoResult: { schools: SchoolDBType[]; stops: StopDBType[] } =
      await ServiceUtils.post("/student-to-school/import", {
        students_to_schools: students_to_schools,
      });

    const new_schools = xanoResult.schools.map((dbSchool) =>
      SchoolEntity.build(dbSchool)
    );

    const new_stops = xanoResult.stops.map((dbStop) =>
      StopEntity.build(dbStop)
    );

    return { schools: new_schools, stops: new_stops };
  }

  static async create(
    classToSchool: Omit<
      AssociatedSchoolType,
      "id" | "schoolName" | "usedQuantity"
    >
  ): Promise<AssociatedSchoolType> {
    const dbFormat = ClassStudentToSchoolEntity.dbFormat(classToSchool);
    const response: AssociatedDBPointType = await ServiceUtils.post(
      "/student-to-school",
      dbFormat
    );
    return EntityUtils.formatAssociatedClassToSchool([response])[0];
  }

  static async update(
    classToSchool: Omit<AssociatedSchoolType, "schoolName" | "usedQuantity">
  ): Promise<AssociatedSchoolType> {
    const dbFormat = ClassStudentToSchoolEntity.dbFormat(classToSchool);
    const response: AssociatedDBPointType = await ServiceUtils.patch(
      "/student-to-school/" + classToSchool.idClassToSchool + "/v2",
      dbFormat
    );
    return EntityUtils.formatAssociatedClassToSchool([response])[0];
  }

  // Backend will return only the id deleted
  static async delete(id: number): Promise<number> {
    const response = await ServiceUtils.delete(
      "/student-to-school/" + id + "/v2"
    );
    return response;
  }
}
