import { createSignal, onMount } from "solid-js";
import {
  CalendarDayEnum,
  CalendarType,
} from "../../../../_entities/calendar.entity";
import {
  TripDirectionEntity,
  TripDirectionEnum,
} from "../../../../_entities/trip-direction.entity";
import { CalendarManager } from "../calendar.manager";

interface RuleItemRadioBtnGroupProps {
  calendar: CalendarType;
  day: CalendarDayEnum;
  isDayChecked: boolean;
}

export function RuleItemRadioBtnGroup(props: RuleItemRadioBtnGroupProps) {
  const [direction, setDirection] = createSignal<TripDirectionEnum>();

  onMount(() => {
    const index = props.calendar.rules.findIndex(
      (item) => item.day == props.day
    );
    const rule = props.calendar.rules[index];

    if (rule && !!rule.tripTypeId) {
      const tripDirection = TripDirectionEntity.findTripById(rule.tripTypeId);

      if (!tripDirection) return;
      setDirection(tripDirection);
    }
  });

  function onChangeDirectionTrip(event: Event & { target: HTMLInputElement }) {
    const directionValue = event.target.value as TripDirectionEnum;
    CalendarManager.updateTripDirection(
      props.calendar,
      props.day,
      directionValue
    );
  }

  return (
    <fieldset class="flex flex-col justify-end align-bottom">
      <input
        name={"trip-type-" + props.day}
        class="my-[5px]"
        type="radio"
        disabled={!props.isDayChecked}
        onChange={onChangeDirectionTrip}
        value="roundTrip"
        checked={direction() == TripDirectionEnum.roundTrip}
      />
      <input
        name={"trip-type-" + props.day}
        class="my-[5px]"
        type="radio"
        disabled={!props.isDayChecked}
        onChange={onChangeDirectionTrip}
        value="going"
        checked={direction() == TripDirectionEnum.going}
      />
      <input
        name={"trip-type-" + props.day}
        class="my-[5px]"
        type="radio"
        disabled={!props.isDayChecked}
        onChange={onChangeDirectionTrip}
        value="coming"
        checked={direction() == TripDirectionEnum.coming}
      />
    </fieldset>
  );
}
