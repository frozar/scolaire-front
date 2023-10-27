import { For } from "solid-js";
import CellItem from "../atom/CellItem";
import { CalendarUtils } from "../calendar.utils";
import { CalendarType } from "../template/Calendar";
import "./MonthCellList.css";

export function MonthCellList(props: { month: Date; calendar: CalendarType }) {
  const actifDays = () =>
    CalendarUtils.getActifDaysOfMonth(props.calendar, props.month);

  return (
    <div class="month-item">
      <div class="month-item-cells">
        <For each={CalendarUtils.getDaysOfMonth(props.month)}>
          {(day) => {
            const currentDate = () =>
              new Date(props.month.getFullYear(), props.month.getMonth(), day);

            const isActive = () =>
              actifDays().find(
                (date) => date.getTime() == currentDate().getTime()
              ) != undefined;

            return (
              <CellItem
                isActive={isActive()}
                isWeekend={CalendarUtils.isWeekend(currentDate())}
                onClick={() => {
                  console.log(CalendarUtils.getNameDay(currentDate()));
                  console.log(isActive());
                }}
              />
            );
          }}
        </For>
      </div>
    </div>
  );
}
