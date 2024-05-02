import {
  AllotmentDBType,
  AllotmentEntity,
  AllotmentType,
} from "../_entities/allotment.entity";
import { ServiceUtils } from "./_utils.service";

export namespace AllotmentService {
  export async function create(allotment: Omit<AllotmentType, "id">) {
    const data = AllotmentEntity.DbFormat(allotment);
    const dbAllotment: AllotmentDBType = await ServiceUtils.post(
      "/allotment",
      data
    );
    return AllotmentEntity.build(dbAllotment);
  }

  export async function update(allotment: AllotmentType) {
    const data = AllotmentEntity.DbFormat(allotment);
    const dbAllotment: AllotmentDBType = await ServiceUtils.patch(
      "/allotment/" + allotment.id,
      data
    );
    return AllotmentEntity.build(dbAllotment);
  }

  export async function deleteAllotment(id?: number): Promise<boolean> {
    const returnValue: boolean = await ServiceUtils.delete("/allotment/" + id);
    return returnValue;
  }
}
