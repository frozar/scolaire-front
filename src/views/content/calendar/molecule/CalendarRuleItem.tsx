import { createSignal, onMount } from "solid-js";
import {
  CalendarDayEnum,
  CalendarType,
} from "../../../../_entities/calendar.entity";
import {
  TripDirectionEntity,
  TripDirectionEnum,
} from "../../../../_entities/trip-direction.entity";
import { LabeledCheckbox } from "../../../../component/molecule/LabeledCheckbox";
import { CalendarManager } from "../calendar.manager";
import { CalendarUtils } from "../calendar.utils";

interface CalendarRuleItemProps {
  calendar: CalendarType;
  day: CalendarDayEnum;
}

export function CalendarRuleItem(props: CalendarRuleItemProps) {
  const [direction, setDirection] = createSignal<TripDirectionEnum>();

  onMount(() => {
    const index = props.calendar.rules.findIndex(
      (item) => item.day == props.day
    );
    const rule = props.calendar.rules[index];

    if (rule && !!rule.tripTypeId) {
      const tripDirection = TripDirectionEntity.findTripById(rule.tripTypeId);
      console.log(tripDirection);

      if (!tripDirection) return;
      setDirection(tripDirection);
      console.log(direction() == TripDirectionEnum.coming);
    }
  });

  const isDayChecked = () =>
    CalendarUtils.isDayInRules(props.day as CalendarDayEnum, props.calendar);

  function onChangeDirectionTrip(event: Event & { target: HTMLInputElement }) {
    console.log(
      "current direction:",
      direction(),
      "to direction:",
      event.target.value
    );
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
      <fieldset class="flex flex-col justify-end align-bottom">
        <input
          name={"trip-type-" + props.day}
          class="my-[5px]"
          type="radio"
          disabled={!isDayChecked()}
          onChange={onChangeDirectionTrip}
          value="roundTrip"
          checked={direction() == TripDirectionEnum.roundTrip}
        />
        <input
          name={"trip-type-" + props.day}
          class="my-[5px]"
          type="radio"
          disabled={!isDayChecked()}
          onChange={onChangeDirectionTrip}
          value="going"
          checked={direction() == TripDirectionEnum.going}
        />
        <input
          name={"trip-type-" + props.day}
          class="my-[5px]"
          type="radio"
          disabled={!isDayChecked()}
          onChange={onChangeDirectionTrip}
          value="coming"
          checked={direction() == TripDirectionEnum.coming}
        />
      </fieldset>
    </div>
  );
}
