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

  function isActiveCell() {
    if (props.action == "add")
      return CalendarUtils.isAnAddedDate(props.date, props.calendar);
    else if (props.action == "remove")
      return CalendarUtils.isADeletedDate(props.date, props.calendar);
    else return CalendarUtils.isActiveDay(props.date, props.calendar);
  }
  return (
    <CellItem
      isActive={isActiveCell()}
      isWeekend={CalendarUtils.isWeekend(props.date)}
      onClick={onClickAction}
    />
  );
}
