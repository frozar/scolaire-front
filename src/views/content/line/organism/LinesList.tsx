import { For } from "solid-js";
import { LineType } from "../../../../_entities/line.entity";
import "./LinesList.css";
import { LineItem } from "../molecule/LineItem";

export function LinesList(props: { lines: LineType[] }) {
  return (
    <div class="lines-list">
      <For each={props.lines}>{(item) => <LineItem line={item} />}</For>
    </div>
  );
}
