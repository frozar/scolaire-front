import {
  ClasseDBType,
  ClasseEntity,
  ClasseType,
} from "../_entities/classe.entity";
import { ServiceUtils } from "./_utils.service";

export namespace ClasseService {
  // TODO: export async function update()

  export async function create(classe: ClasseType): Promise<ClasseType> {
    const data = ClasseEntity.dbFormat(classe);
    const dbClasse: ClasseDBType = await ServiceUtils.post("/classe", data);
    return ClasseEntity.build(dbClasse);
  }
}
