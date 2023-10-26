import { For } from "solid-js";
import { CalendarUtils } from "../calendar.utils";
import { CalendarType } from "../template/Calendar";
import { CellItemLogic } from "./CellItemLogic";
import "./MonthCellList.css";

const stringToDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split("-");
  return new Date([month, day, year].join("/"));
};

export function MonthCellList(props: { month: Date; calendar: CalendarType }) {
  const actifDays = () =>
    CalendarUtils.getActifDaysOfMonth(props.calendar, props.month);

  return (
    <div class="month-item">
      <div class="month-item-cells">
        <For each={CalendarUtils.getDaysOfMonth(props.month)}>
          {(day) => (
            <CellItemLogic
              actifDays={actifDays()}
              day={day}
              month={props.month}
            />
          )}
        </For>
      </div>
    </div>
  );
}
