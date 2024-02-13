import {
  AllotmentType,
  setAllotment,
} from "../views/content/allotment/organism/Allotment";
import { ServiceUtils } from "./_utils.service";

export namespace AllotmentService {
  export async function create(allotment: Omit<AllotmentType, "id">) {
    const dbAllotment: AllotmentType[] = await ServiceUtils.post(
      "/allotment",
      allotment
    );
    setAllotment(dbAllotment);
  }

  export async function update(allotment: Partial<AllotmentType>) {
    const dbAllotment: AllotmentType = await ServiceUtils.patch(
      "/allotment/" + allotment.id,
      allotment
    );
    setAllotment((prev) => {
      if (!prev) return prev;
      return [...prev].map((allotment) => {
        if (allotment.id == dbAllotment.id) {
          allotment = dbAllotment;
        }
        return allotment;
      });
    });
  }

  export async function deleteAllotment(id?: number): Promise<boolean> {
    const returnValue: boolean = await ServiceUtils.delete("/allotment/" + id);
    setAllotment((prev) => {
      if (!prev) return prev;
      return [...prev].filter((allotment) => {
        if (allotment.id == id) {
          return;
        }
        return allotment;
      });
    });
    return returnValue;
  }
}
