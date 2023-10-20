import { Accessor, Setter } from "solid-js";
import { HeureFormat } from "../../../../../_entities/grade.entity";
import TimeInput from "../atom/TimeInput";

interface TimeSchedulesInputProps {
  startSetter: Setter<HeureFormat>;
  start: Accessor<HeureFormat | undefined>;

  endSetter: Setter<HeureFormat>;
  end: Accessor<HeureFormat | undefined>;
}

export default function (props: TimeSchedulesInputProps) {
  function validateSchedule(schedule: string) {
    const [houre, minute] = schedule.split(":");
    if (isNaN(Number(houre)) || isNaN(Number(minute))) return false;
    const roundedMinute = Math.round(Number(minute) / 5) * 5;

    return {
      hour: Number(houre),
      minutes: Number(roundedMinute),
    };
  }

  function onInputStart(value: string) {
    const formatedSchedule = validateSchedule(value);
    if (!formatedSchedule) return;
    props.startSetter(formatedSchedule);
  }

  function onInputEnd(value: string) {
    const formatedSchedule = validateSchedule(value);
    if (!formatedSchedule) return;
    props.endSetter(formatedSchedule);
  }

  function value(schedule: HeureFormat | undefined) {
    if (schedule == undefined) return "";
    let houre = schedule.hour.toString();
    let minutes = schedule.minutes.toString();

    if (houre.length == 1) houre = "0" + houre;
    if (minutes.length == 1) minutes = "0" + minutes;
    if (Number(minutes) > 59) minutes = "59";
    return houre + ":" + minutes;
  }

  return (
    <div class="flex justify-between w-[70%]">
      <TimeInput onInput={onInputStart} value={value(props.start())} />

      <p>à</p>
      <TimeInput onInput={onInputEnd} value={value(props.end())} />
    </div>
  );
}
