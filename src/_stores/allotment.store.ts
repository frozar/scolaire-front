import { createSignal } from "solid-js";
import { AllotmentType } from "../_entities/allotment.entity";

const [getAllotment, setAllotment] = createSignal<AllotmentType[]>([]);

export namespace AllotmentStore {
  export function set(
    allotment: AllotmentType[] | ((prev: AllotmentType[]) => AllotmentType[])
  ) {
    setAllotment(allotment);
  }

  export function get() {
    return getAllotment();
  }

  export function add(allotment: AllotmentType) {
    set((prev) => {
      prev.push(allotment);
      return [...prev];
    });
  }

  export function remove(id: number) {
    set((prev) => {
      return prev.filter((allotment) => allotment.id != id);
    });
  }
}
