import { For } from "solid-js";
import { BusLineType } from "../../../../../_entities/bus-line.entity";
import LineItem from "../molecule/LineItem";

export default function (props: { lines: BusLineType[] }) {
  return (
    <div class="school-details-line-list">
      <For each={props.lines}>{(item) => <LineItem line={item} />}</For>
    </div>
  );
}
