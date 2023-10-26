import { For } from "solid-js";
import { MonthCellList } from "../molecule/MonthCellList";
import { CalendarType } from "../template/Calendar";
import "./MonthListContent.css";

export default function (props: { month: Date; calendar: CalendarType }) {
  return (
    <div class="month-list-cells-wrapper">
      <For each={[0, 1, 2]}>
        {(index) => (
          <MonthCellList
            month={
              new Date(
                props.month.getFullYear(),
                props.month.getMonth() + index
              )
            }
            calendar={props.calendar}
          />
        )}
      </For>
    </div>
  );
}
