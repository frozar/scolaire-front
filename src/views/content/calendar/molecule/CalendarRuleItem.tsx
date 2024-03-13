import {
  CalendarDayEnum,
  CalendarType,
} from "../../../../_entities/calendar.entity";
import {
  TripDirectionEntity,
  TripDirectionEnum,
} from "../../../../_entities/trip-direction.entity";
import { calendars } from "../../../../_stores/calendar.store";
import { LabeledCheckbox } from "../../../../component/molecule/LabeledCheckbox";
import { CalendarManager } from "../calendar.manager";
import { CalendarUtils } from "../calendar.utils";
import { RuleItemRadioBtnGroup } from "./RuleItemRadioBtnGroup";

interface CalendarRuleItemProps {
  calendar: CalendarType;
  day: CalendarDayEnum;
}

export function CalendarRuleItem(props: CalendarRuleItemProps) {
  //TODO refactor code
  // eslint-disable-next-line solid/reactivity
  const initialRule = calendars()
    // eslint-disable-next-line solid/reactivity
    .find((item) => item.id == props.calendar.id)
    // eslint-disable-next-line solid/reactivity
    ?.rules.find((item) => item.day == props.day);

  const defaultTripdirection = TripDirectionEntity.findDirectionByDirectionName(
    TripDirectionEnum.roundTrip
  );

  const rule = () =>
    props.calendar.rules.find((item) => item.day == props.day) ??
    initialRule ?? {
      day: props.day,
      tripDirection: defaultTripdirection,
      tripTypeId: defaultTripdirection.id,
    };

  const isDayChecked = () =>
    CalendarUtils.isDayInRules(props.day as CalendarDayEnum, props.calendar);

  return (
    <div class="calendar-rule-item">
      <LabeledCheckbox
        for={props.day}
        label={CalendarUtils.dayToFrench(props.day as CalendarDayEnum)}
        checked={isDayChecked()}
        onChange={() => {
          CalendarManager.updateCalendarRules(rule());
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
