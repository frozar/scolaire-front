import { BusCategoryType, getBus } from "../views/content/bus/organism/Bus";

//TODO migrer la logique "[getBus, setBus] = createSignal<BusCategoryType[]>([])" depuis Bus.tsx

export namespace BusStore {
  export function getById(id: number): BusCategoryType {
    return getBus().find((bus) => bus.id == id) as BusCategoryType;
  }
}
