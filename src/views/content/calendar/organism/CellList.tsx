import { For } from "solid-js";
import { MonthCellItem } from "../molecule/MonthCellItem";
import "./CellList.css";

export default function (props: { month: Date }) {
  return (
    <div class="month-list-cells-wrapper">
      <For each={[0, 1, 2]}>
        {(index) => (
          <MonthCellItem
            month={
              new Date(
                props.month.getFullYear(),
                props.month.getMonth() + index
              )
            }
          />
        )}
      </For>
    </div>
  );
}
