import {
  CalendarDayEnum,
  CalendarType,
} from "../../../../_entities/calendar.entity";
import { CalendarManager } from "../calendar.manager";
import { CalendarUtils } from "../calendar.utils";

import "./LabeledCheckbox.css";

interface LabeledCheckboxProps {
  day: CalendarDayEnum;
  calendar: CalendarType;
}

export function LabeledCheckbox(props: LabeledCheckboxProps) {
  function onChange() {
    CalendarManager.updateCalendarRules(props.day);
  }

  return (
    <div class="labeled-inline-checkbox">
      <label for={"day-" + props.day}>
        {CalendarUtils.dayToFrench(props.day)}
      </label>
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
