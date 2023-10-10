import { For } from "solid-js";
import { LineType } from "../../../../../_entities/line.entity";
import BusLineItem from "../molecule/BusLineItem";
import "./BusLinesList.css";

export default function (props: { lines: LineType[] }) {
  return (
    <div class="school-details-line-list">
      <For each={props.lines}>{(item) => <BusLineItem line={item} />}</For>
    </div>
  );
}
