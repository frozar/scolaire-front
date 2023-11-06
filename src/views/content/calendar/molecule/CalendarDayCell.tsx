import { CalendarType } from "../../../../_entities/calendar.entity";
import CellItem from "../atom/CellItem";
import { CalendarUtils } from "../calendar.utils";

export function CalendarDayCell(props: { date: Date; calendar: CalendarType }) {
  return (
    <CellItem
      isActive={CalendarUtils.isActiveDay(props.date, props.calendar)}
      isWeekend={CalendarUtils.isWeekend(props.date)}
      onClick={() => {
        console.log(props.date);
      }}
    />
  );
}
