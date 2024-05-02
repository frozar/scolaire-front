import { createSignal } from "solid-js";
import { TransporterType } from "../_entities/transporter.entity";

const [getTransporter, setTransporter] = createSignal<TransporterType[]>([]);

export namespace TransporterStore {
  export function set(
    allotment:
      | TransporterType[]
      | ((prev: TransporterType[]) => TransporterType[])
  ) {
    setTransporter(allotment);
  }

  export function get() {
    return getTransporter();
  }

  export function add(transporter: TransporterType) {
    set((prev) => {
      prev.push(transporter);
      return [...prev];
    });
  }

  export function remove(id: number) {
    set((prev) => {
      return prev.filter((transporter) => transporter.id != id);
    });
  }
}
