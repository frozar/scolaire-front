import {
  SchoolDBType,
  SchoolEntity,
  SchoolType,
  importSchoolsDBType,
} from "../_entities/school.entity";
import { ServiceUtils } from "./_utils.service";

export class SchoolService {
  static async import(schools: importSchoolsDBType): Promise<SchoolType[]> {
    const xanoResult: { school: SchoolDBType[] } = await ServiceUtils.post(
      "/school/import",
      schools
    );

    return xanoResult.school.map((dbSchool) => SchoolEntity.build(dbSchool));
  }

  //TODO change Omit to Pick
  static async create(
    school: Omit<
      SchoolType,
      "id" | "selected" | "associated" | "setSelected" | "nature" | "leafletId"
    >
  ): Promise<SchoolType> {
    const data = SchoolEntity.dbFormat(school);
    const dbSchool: SchoolDBType = await ServiceUtils.post("/school", data);
    return SchoolEntity.build(dbSchool);
  }

  static async update(
    school: Omit<
      SchoolType,
      "associated" | "selected" | "setSelected" | "nature" | "leafletId"
    >
  ): Promise<SchoolType> {
    const data = SchoolEntity.dbFormat(school);
    const dbSchool: SchoolDBType = await ServiceUtils.patch(
      "/school/" + school.id,
      data
    );
    if (dbSchool == null) return dbSchool;
    return SchoolEntity.build(dbSchool);
  }

  // TODO no tested : school supression process on stand by
  static async delete(id: number): Promise<number> {
    return await ServiceUtils.delete("/school/" + id);
  }
}
