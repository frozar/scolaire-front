import { CalendarType } from "../../../../_entities/calendar.entity";
import CellItem from "../atom/CellItem";
import { CalendarUtils } from "../calendar.utils";
import { CalendarActionsEnum } from "../template/Calendar";

interface CalendarDayCellProps {
  date: Date;
  calendar: CalendarType;
  action?: CalendarActionsEnum;
  onClickAction?: (date: Date) => void;
}

export function CalendarDayCell(props: CalendarDayCellProps) {
  const onClickAction = () => {
    if (props.onClickAction != undefined) props.onClickAction(props.date);
    return;
  };

  function isActiveCell() {
    switch (props.action) {
      case CalendarActionsEnum.add:
        return CalendarUtils.isAnAddedDate(props.date, props.calendar);
      case CalendarActionsEnum.remove:
        return CalendarUtils.isADeletedDate(props.date, props.calendar);
      case CalendarActionsEnum.rules:
        return CalendarUtils.isARulesDate(props.date, props.calendar);
      default:
        return CalendarUtils.isActiveDay(props.date, props.calendar);
    }
  }

  return (
    <CellItem
      isActive={isActiveCell()}
      isWeekend={CalendarUtils.isWeekend(props.date)}
      onClick={onClickAction}
    />
  );
}
