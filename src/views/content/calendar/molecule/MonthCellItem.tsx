import { For } from "solid-js";
import CellItem from "../atom/CellItem";
import { CalendarUtils } from "../calendar.utils";
import "./MonthCellItem.css";

export function MonthCellItem(props: { month: Date }) {
  return (
    <div class="month-item">
      <div class="month-item-cells">
        <For each={CalendarUtils.getDaysOfMonth(props.month)}>
          {() => <CellItem />}
        </For>
      </div>
    </div>
  );
}
