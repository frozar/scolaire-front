import {
  CalendarPeriodType,
  CalendarType,
} from "../../../../_entities/calendar.entity";
import CellItem from "../atom/CellItem";
import { CalendarUtils } from "../calendar.utils";
import { CalendarActionsEnum } from "../template/Calendar";

interface CalendarDayCellProps {
  date: Date;
  calendar?: CalendarType;
  calendarPeriod?: CalendarPeriodType;
  action?: CalendarActionsEnum;
  onClickAction?: (date: Date) => void;
  coloredCell?: boolean;
}

export function CalendarDayCell(props: CalendarDayCellProps) {
  const onClickAction = () => {
    if (props.onClickAction != undefined) props.onClickAction(props.date);
    return;
  };

  function isActiveCell() {
    if (props.calendar)
      // * Depend on props.action
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
    else return false;
  }

  function outPeriod() {
    if (props.calendarPeriod)
      return !CalendarUtils.dayIsInPeriod(props.date, props.calendarPeriod);
    else return false;
  }

  function isVacation() {
    if (props.calendarPeriod)
      return CalendarUtils.dayIsInVacation(props.date, props.calendarPeriod);
    else return false;
  }

  function isPublicHoliday() {
    if (props.calendarPeriod)
      return CalendarUtils.dayIsPublicHoliday(props.date, props.calendarPeriod);
    else return false;
  }

  return (
    <CellItem
      isActive={isActiveCell()}
      isWeekend={CalendarUtils.isWeekend(props.date)}
      onClick={onClickAction}
      outPeriod={outPeriod()}
      isVacation={isVacation()}
      isPublicHoliday={isPublicHoliday()}
      coloredCell={props.coloredCell}
    />
  );
}
