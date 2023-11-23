import { createSignal, onMount } from "solid-js";
import { HourFormat } from "../../../../../_entities/grade.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import TimesInputWrapper from "../molecule/TimesInputWrapper";

interface SchoolHoursSlotsProps {
  school?: SchoolType;
}

export function SchoolHoursSlots(props: SchoolHoursSlotsProps) {
  const [comingStart, setComingStart] = createSignal<HourFormat>();
  const [comingEnd, setComingEnd] = createSignal<HourFormat>();

  const [goingStart, setGoingStart] = createSignal<HourFormat>();
  const [goingEnd, setGoingEnd] = createSignal<HourFormat>();

  onMount(() => {
    if (props.school?.hours) {
      setComingStart(props.school.hours.startHourComing);
      setComingEnd(props.school.hours.endHourComing);
      setGoingStart(props.school.hours.startHourGoing);
      setGoingEnd(props.school.hours.endHourGoing);
    }
  });

  return (
    <div>
      <TimesInputWrapper
        label="Horaires d'arrivé"
        startSetter={setComingStart}
        start={comingStart}
        endSetter={setComingEnd}
        end={comingEnd}
      />
      <TimesInputWrapper
        label="Horaires de départ"
        startSetter={setGoingStart}
        start={goingStart}
        endSetter={setGoingEnd}
        end={goingEnd}
      />
    </div>
  );
}
