import {
  SchoolDBType,
  SchoolEntity,
  SchoolType,
} from "../_entities/school.entity";
import { ServiceUtils } from "./_utils.service";

export class SchoolService {
  static async getAll(): Promise<SchoolType[]> {
    const dbSchools: SchoolDBType[] = await ServiceUtils.get("/school");
    return dbSchools.map((dbSchool) => SchoolEntity.build(dbSchool));
  }

  static async importSchools(
    schools: Pick<SchoolDBType, "name" | "location">[]
  ): Promise<SchoolType[]> {
    const xanoResult: SchoolDBType[] = await ServiceUtils.post(
      "/school/import",
      { schools: schools }
    );

    return xanoResult.map((dbSchool) => SchoolEntity.build(dbSchool));
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
  static async delete(id: number): Promise<boolean> {
    return await ServiceUtils.delete("/school/" + id);
  }
  static dataToDB(datas: Pick<SchoolType, "name" | "lon" | "lat">[]) {
    return datas.map((data) => {
      return SchoolEntity.dbFormat({
        name: data.name,
        lat: +data.lat,
        lon: +data.lon,
      });
    });
  }
}
