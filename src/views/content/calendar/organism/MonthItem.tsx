import { For } from "solid-js";
import { MonthType } from "./Calendar";
import "./MonthItem.css";

export default function (props: { month: MonthType }) {
  return (
    <div class="month-item">
      <p>{props.month.monthName}</p>
      <div class="month-days">
        <For each={props.month.days}>
          {(index) => <div class="day-item">{index}</div>}
        </For>
      </div>

      <div class="calendar-cells">
        <For each={props.month.days}>{() => <div class="cell-item  " />}</For>
      </div>
    </div>
  );
}
