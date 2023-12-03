import {
  CalendarPeriodType,
  CalendarType,
} from "../../../../_entities/calendar.entity";
import { setRemoveConfirmation } from "../../../../userInformation/RemoveConfirmation";
import { CalendarManager } from "../calendar.manager";
import { CalendarLineName } from "../molecule/CalendarLineName";
import { CalendarMonthsDetails } from "../molecule/CalendarMonthsDetails";
import {
  calendarsPeriod,
  currentCalendar,
  onCalendarsPeriod,
  setCurrentCalendar,
  setOnCalendarsPeriod,
} from "../template/Calendar";
import "./CalendarLineContent.css";

interface CalendarLineContentProps {
  month: Date;
  calendar?: CalendarType;
  calendarPeriod?: CalendarPeriodType;
  displayIcon?: boolean;
}

// * Why calendar? & calendarPeriod? is possible undefine ? to avoid to have multiple relatively same component
export function CalendarLineContent(props: CalendarLineContentProps) {
  const calendarName = () => props.calendar?.name ?? props.calendarPeriod?.name;
  const isCalendarOrCalendarPeriod = (): "calendar" | "calendarPeriod" => {
    if (props.calendar) return "calendar";
    else return "calendarPeriod";
  };

  const calendarPeriod = () => {
    if (props.calendar)
      return calendarsPeriod().find(
        (item) => item.id == props.calendar?.calendarPeriodId
      );
    else return props.calendarPeriod;
  };

  function onClick() {
    if (props.calendar) setCurrentCalendar(props.calendar);
    else setOnCalendarsPeriod(props.calendarPeriod);
  }

  function isActiveLine(): boolean {
    if (props.calendar) return currentCalendar()?.id == props.calendar?.id;
    else return onCalendarsPeriod()?.id == calendarPeriod()?.id;
  }

  function onClickDeleteCalendar() {
    setRemoveConfirmation({
      textToDisplay: "Êtes-vous sûr de vouloir supprimer le calendrier: ",
      itemName: calendarName() as string,
      validate: () => {
        if (isCalendarOrCalendarPeriod() == "calendar")
          return CalendarManager.deleteCalendar(props.calendar?.id as number);
        else
          return CalendarManager.deleteCalendarPeriod(
            props.calendarPeriod?.id as number
          );
      },
    });
  }

  return (
    <div
      class="calendar-line-content"
      onClick={onClick}
      classList={{ active: isActiveLine() }}
    >
      <CalendarLineName
        calendarName={calendarName() as string}
        onClickDeleteCalendar={onClickDeleteCalendar}
      />
      <CalendarMonthsDetails
        month={props.month}
        calendar={props.calendar}
        calendarPeriod={calendarPeriod()}
        coloredCell={!!props.calendarPeriod}
        displayIcon={props.displayIcon}
      />
    </div>
  );
}
