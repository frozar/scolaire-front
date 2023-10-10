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

  export async function update(classe: ClasseType): Promise<ClasseType> {
    const data = ClasseEntity.dbFormat(classe);
    const dbClasse: ClasseDBType = await ServiceUtils.patch(
      "/classe/" + classe.id,
      data
    );
    if (dbClasse == null) return dbClasse;
    return ClasseEntity.build(dbClasse);
  }
}
