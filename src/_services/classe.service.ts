import {
  ClasseDBType,
  ClasseEntity,
  ClasseType,
} from "../_entities/classe.entity";
import { ServiceUtils } from "./_utils.service";

export class ClasseService {
  // TODO: static async update()

  static async create(classe: ClasseType): Promise<ClasseType> {
    const data = ClasseEntity.dbFormat(classe);
    const dbClasse: ClasseDBType = await ServiceUtils.post("/classe", data);
    console.log("returned dbClasse =>", dbClasse);
    return ClasseEntity.build(dbClasse);
  }
}
