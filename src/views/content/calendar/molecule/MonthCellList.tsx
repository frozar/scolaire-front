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
          {(day) => {
            const currentDate = () =>
              new Date(props.month.getFullYear(), props.month.getMonth(), day);

            const getCurrentDateToString = () => currentDate().toString();
            const getDayString = () => getCurrentDateToString().substring(0, 3);
            const isWeekend = () =>
              getDayString() == "Sat" || getDayString() == "Sun";

            function onCLick() {
              console.log("Cell click");
            }

            return (
              <CellItem
                isActive={false}
                isWeekend={isWeekend()}
                onClick={onCLick}
              />
            );
          }}
        </For>
      </div>
    </div>
  );
}
