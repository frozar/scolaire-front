import { BusCategoryType } from "../_entities/bus.entity";
import { getBus, setBus } from "../views/content/bus/organism/Bus";
import { ServiceUtils } from "./_utils.service";

export namespace BusService {
  export async function create(bus: Omit<BusCategoryType, "id">) {
    await ServiceUtils.post("/bus", bus);
  }

  export async function update(bus: Partial<BusCategoryType>) {
    const dbBus: BusCategoryType = await ServiceUtils.patch(
      "/bus/" + bus.id,
      bus
    );
    console.log("dbBus", dbBus);
    setBus((prev) => {
      if (!prev) return prev;
      return [...prev].map((bus) => {
        if (bus.id == dbBus.id) {
          bus = dbBus;
        }
        return bus;
      });
    });
    console.log("getBus()", getBus());
  }

  export async function deleteBus(id?: number): Promise<boolean> {
    const returnValue: boolean = await ServiceUtils.delete("/bus/" + id);
    setBus((prev) => {
      if (!prev) return prev;
      return [...prev].filter((bus) => {
        if (bus.id == id) {
          return;
        }
        return bus;
      });
    });
    return returnValue;
  }
}
