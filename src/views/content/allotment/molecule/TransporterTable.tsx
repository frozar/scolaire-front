import { createSignal } from "solid-js";
import { TransporterType } from "../../../../_entities/transporter.entity";

export const [getAllTransporter, setAllTransporter] = createSignal<
  TransporterType[]
>([]);

export function TransporterTable() {
  return <div />;
}
