import { GradeDBType, GradeEntity, GradeType } from "../_entities/grade.entity";
import { ServiceUtils } from "./_utils.service";

export class GradeService {
  static async create(grade: GradeType): Promise<GradeType> {
    const data = GradeEntity.dbFormat(grade);
    const dbGrade: GradeDBType = await ServiceUtils.post("/grade", data);
    return GradeEntity.build(dbGrade);
  }

  static async update(grade: GradeType): Promise<GradeType> {
    const data = GradeEntity.dbFormat(grade);
    const dbGrade: GradeDBType = await ServiceUtils.patch(
      "/grade/" + grade.id,
      data
    );
    if (dbGrade == null) return dbGrade;
    return GradeEntity.build(dbGrade);
  }

  static async delete(id: number): Promise<number> {
    return await ServiceUtils.delete("/grade/" + id);
  }
}
