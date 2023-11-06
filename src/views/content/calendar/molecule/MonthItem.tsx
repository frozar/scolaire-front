import { For } from "solid-js";
import DayItem from "../atom/DayItem";
import { CalendarUtils } from "../calendar.utils";
import "./MonthItem.css";

export default function (props: { month: Date }) {
  return (
    <div class="month-item">
      <p class="month-item-name">
        {CalendarUtils.getMonthName(props.month)} {props.month.getFullYear()}
      </p>
      <div class="month-item-days">
        <For each={CalendarUtils.getDaysOfMonth(props.month)}>
          {(date) => <DayItem day={date} />}
        </For>
      </div>
    </div>
  );
}
