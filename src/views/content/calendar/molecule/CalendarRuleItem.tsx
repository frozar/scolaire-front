import {
  CalendarDayEnum,
  CalendarType,
} from "../../../../_entities/calendar.entity";
import { LabeledCheckbox } from "../../../../component/molecule/LabeledCheckbox";
import { CalendarManager } from "../calendar.manager";
import { CalendarUtils } from "../calendar.utils";

interface CalendarRuleItemProps {
  calendar: CalendarType;
  day: CalendarDayEnum;
}

export function CalendarRuleItem(props: CalendarRuleItemProps) {
  const isDayChecked = () =>
    CalendarUtils.isDayInRules(props.day as CalendarDayEnum, props.calendar);

  // TODO complete the conditions
  const roundTripChecked = () => isDayChecked();
  const goingChecked = () => isDayChecked();
  const comingChecked = () => isDayChecked();

  function onChangeRoundTrip() {
    console.log("TODO");
  }

  function onChangeGoingTrip() {
    console.log("TODO");
  }

  function onChangeComingTrip() {
    console.log("TODO");
  }

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

      <LabeledCheckbox
        for={props.day + "-going-coming"}
        label=""
        onChange={onChangeRoundTrip}
        checked={roundTripChecked()}
        disabled={!isDayChecked()}
        verticalOffset={true}
      />

      <LabeledCheckbox
        for={props.day + "-going"}
        label=""
        onChange={onChangeGoingTrip}
        checked={goingChecked()}
        disabled={!isDayChecked()}
        verticalOffset={true}
      />

      <LabeledCheckbox
        for={props.day + "-coming"}
        label=""
        onChange={onChangeComingTrip}
        checked={comingChecked()}
        disabled={!isDayChecked()}
        verticalOffset={true}
      />
    </div>
  );
}
