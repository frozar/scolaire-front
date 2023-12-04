import { createEffect, createSignal } from "solid-js";
import {
  CalendarDayEnum,
  CalendarType,
  RulesType,
} from "../../../../_entities/calendar.entity";
import {
  TripDirectionEntity,
  TripDirectionEnum,
} from "../../../../_entities/trip-direction.entity";
import { RadioButton } from "../../../../component/atom/RadioButton";
import { CalendarManager } from "../calendar.manager";

interface RuleItemRadioBtnGroupProps {
  calendar: CalendarType;
  day: CalendarDayEnum;
  isDayChecked: boolean;
}

export function RuleItemRadioBtnGroup(props: RuleItemRadioBtnGroupProps) {
  const [direction, setDirection] = createSignal<TripDirectionEnum>(
    TripDirectionEnum.roundTrip
  );

  const defaultDirection = (rule?: RulesType) =>
    rule
      ? TripDirectionEntity.findTripById(rule.tripTypeId as number).type
      : TripDirectionEntity.findTripByDirection(TripDirectionEnum.roundTrip)
          .type;

  createEffect(() => {
    const rule = props.calendar.rules.find((item) => item.day == props.day);
    setDirection(defaultDirection(rule));
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
      <RadioButton
        checked={direction() == TripDirectionEnum.roundTrip}
        name={"trip-type-" + props.day}
        disabled={!props.isDayChecked}
        onChange={onChangeDirectionTrip}
        value="roundTrip"
      />
      <RadioButton
        checked={direction() == TripDirectionEnum.going}
        name={"trip-type-" + props.day}
        disabled={!props.isDayChecked}
        onChange={onChangeDirectionTrip}
        value="going"
      />
      <RadioButton
        checked={direction() == TripDirectionEnum.coming}
        name={"trip-type-" + props.day}
        disabled={!props.isDayChecked}
        onChange={onChangeDirectionTrip}
        value="coming"
      />
    </fieldset>
  );
}
