import {
  ClasseDBType,
  ClasseEntity,
  ClasseType,
} from "../_entities/classe.entity";
import { ServiceUtils } from "./_utils.service";

export class ClasseService {
  static async create(classe: ClasseType): Promise<ClasseType> {
    const data = ClasseEntity.dbFormat(classe);
    const dbClasse: ClasseDBType = await ServiceUtils.post(
      "/classe",
      data,
      false
    );
    return ClasseEntity.build(dbClasse);
  }

  static async update(classe: ClasseType): Promise<ClasseType> {
    const data = ClasseEntity.dbFormat(classe);
    const dbClasse: ClasseDBType = await ServiceUtils.patch(
      "/classe/" + classe.id,
      data,
      false
    );
    if (dbClasse == null) return dbClasse;
    return ClasseEntity.build(dbClasse);
  }

  static async delete(id: number): Promise<boolean> {
    return await ServiceUtils.delete("/classe/" + id, false);
  }
}
