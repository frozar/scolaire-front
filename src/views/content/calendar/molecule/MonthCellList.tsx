import { For } from "solid-js";
import CellItem from "../atom/CellItem";
import { CalendarUtils } from "../calendar.utils";
import { CalendarType } from "../template/Calendar";
import "./MonthCellList.css";

export function MonthCellList(props: { month: Date; calendar: CalendarType }) {
  return (
    <div class="month-item">
      <div class="month-item-cells">
        <For each={CalendarUtils.getDaysOfMonth(props.month)}>
          {() => <CellItem calendar={props.calendar} />}
        </For>
      </div>
    </div>
  );
}
