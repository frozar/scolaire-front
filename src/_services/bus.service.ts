import { BusCategoryType, setBus } from "../views/content/bus/organism/Bus";
import { ServiceUtils } from "./_utils.service";

export namespace BusService {
  export async function create(bus: Omit<BusCategoryType, "id">) {
    const dbBus: BusCategoryType[] = await ServiceUtils.post("/bus", bus);
    setBus(dbBus);
  }

  export async function update(bus: Partial<BusCategoryType>) {
    const dbBus: BusCategoryType = await ServiceUtils.patch(
      "/bus/" + bus.id,
      bus
    );
    setBus((prev) => {
      if (!prev) return prev;
      return [...prev].map((bus) => {
        if (bus.id == dbBus.id) {
          bus = dbBus;
        }
        return bus;
      });
    });
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
