import { BusCategoryType } from "../_entities/bus.entity";
import { setBus } from "../views/content/bus/organism/Bus";
import { ServiceUtils } from "./_utils.service";

export namespace BusService {
  export async function create(bus: Omit<BusCategoryType, "id">) {
    const dbbus: BusCategoryType = await ServiceUtils.post("/bus", bus);
  }

  export async function update(bus: Partial<BusCategoryType>) {
    const dbbus: BusCategoryType = await ServiceUtils.patch("/bus/" + bus.id, bus); 
    setBus((prev) => {
      if (!prev) return prev;
      return [...prev].map(bus => {
        if (bus.id == dbbus.id) {
          bus = dbbus;
        }
        return bus;
      })
    })
  }

  export async function deleteBus(id?: number): Promise<boolean> {
    const returnValue: boolean = await ServiceUtils.delete("/bus/" + id);
    setBus((prev) => {
      if (!prev) return prev;
      return [...prev].filter(bus => {
        if (bus.id == id) {
            return;
        }
        return bus;
      })
    })
    return returnValue;
  }

}
