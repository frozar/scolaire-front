import { CalendarType } from "../../../../_entities/calendar.entity";
import CellItem from "../atom/CellItem";
import { CalendarUtils } from "../calendar.utils";

export function CalendarDayCell(props: {
  date: Date;
  calendar: CalendarType;
  action?: "add" | "remove";
  onClickAction?: (date: Date) => void;
}) {
  const onClickAction = () => {
    if (props.onClickAction != undefined) props.onClickAction(props.date);
    return;
  };

  return (
    <CellItem
      isActive={
        !props.action
          ? CalendarUtils.isActiveDay(props.date, props.calendar)
          : CalendarUtils.isDateAddedDate(props.date, props.calendar)
      }
      isWeekend={CalendarUtils.isWeekend(props.date)}
      onClick={onClickAction}
    />
  );
}
