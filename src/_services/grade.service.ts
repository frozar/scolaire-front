import { GradeDBType, GradeEntity, GradeType } from "../_entities/grade.entity";
import { ServiceUtils } from "./_utils.service";

export class GradeService {
  static async create(classe: GradeType): Promise<GradeType> {
    const data = GradeEntity.dbFormat(classe);
    const dbGrade: GradeDBType = await ServiceUtils.post(
      "/classe",
      data,
      false
    );
    return GradeEntity.build(dbGrade);
  }

  static async update(classe: GradeType): Promise<GradeType> {
    const data = GradeEntity.dbFormat(classe);
    const dbGrade: GradeDBType = await ServiceUtils.patch(
      "/classe/" + classe.id,
      data,
      false
    );
    if (dbGrade == null) return dbGrade;
    return GradeEntity.build(dbGrade);
  }

  static async delete(id: number): Promise<boolean> {
    return await ServiceUtils.delete("/classe/" + id, false);
  }
}
