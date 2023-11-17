import {
  CalendarDayEnum,
  CalendarType,
} from "../../../../_entities/calendar.entity";
import { LabeledCheckbox } from "../../../../component/molecule/LabeledCheckbox";
import { CalendarManager } from "../calendar.manager";
import { CalendarUtils } from "../calendar.utils";
import { RuleItemRadioBtnGroup } from "./RuleItemRadioBtnGroup";

interface CalendarRuleItemProps {
  calendar: CalendarType;
  day: CalendarDayEnum;
}

export function CalendarRuleItem(props: CalendarRuleItemProps) {
  const isDayChecked = () =>
    CalendarUtils.isDayInRules(props.day as CalendarDayEnum, props.calendar);

  return (
    <div class="calendar-rule-item">
      <LabeledCheckbox
        for={props.day}
        label={CalendarUtils.dayToFrench(props.day as CalendarDayEnum)}
        checked={isDayChecked()}
        onChange={() => {
          CalendarManager.updateCalendarRules(props.day as CalendarDayEnum);
        }}
      />
      <RuleItemRadioBtnGroup
        calendar={props.calendar}
        day={props.day}
        isDayChecked={isDayChecked()}
      />
    </div>
  );
}
