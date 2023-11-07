import {
  CalendarDayEnum,
  CalendarType,
} from "../../../../_entities/calendar.entity";
import { CalendarUtils } from "../calendar.utils";
import { updateCalendarRules } from "../template/Calendar";

import "./LabeledCheckbox.css";

interface LabeledCheckboxProps {
  day: CalendarDayEnum;
  calendar: CalendarType;
}

function dayToFrench(day: CalendarDayEnum): string {
  switch (day) {
    case CalendarDayEnum.monday:
      return "Lundi";
    case CalendarDayEnum.tuesday:
      return "Mardi";
    case CalendarDayEnum.wednesday:
      return "Mercredi";
    case CalendarDayEnum.thursday:
      return "Jeudi";
    case CalendarDayEnum.friday:
      return "Vendredi";
  }
}

export function LabeledCheckbox(props: LabeledCheckboxProps) {
  function onChange() {
    updateCalendarRules(props.day);
  }

  return (
    <div class="labeled-inline-checkbox">
      <label for={"day-" + props.day}>{dayToFrench(props.day)}</label>
      <input
        onChange={onChange}
        type="checkbox"
        id={"day-" + props.day}
        checked={CalendarUtils.isDayInRules(
          props.day as CalendarDayEnum,
          props.calendar
        )}
      />
    </div>
  );
}
