import { AllotmentType } from "../_entities/allotment.entity";
import { ServiceUtils } from "./_utils.service";

export namespace AllotmentService {
  export async function create(allotment: Omit<AllotmentType, "id">) {
    const dbAllotment: AllotmentType = await ServiceUtils.post(
      "/allotment",
      allotment
    );
    return dbAllotment;
  }

  export async function update(allotment: Partial<AllotmentType>) {
    const dbAllotment: AllotmentType = await ServiceUtils.patch(
      "/allotment/" + allotment.id,
      allotment
    );
    return dbAllotment;
  }

  export async function deleteAllotment(id?: number): Promise<boolean> {
    const returnValue: boolean = await ServiceUtils.delete("/allotment/" + id);
    return returnValue;
  }
}
