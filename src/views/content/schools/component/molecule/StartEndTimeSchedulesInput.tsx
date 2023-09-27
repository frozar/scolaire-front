import { Accessor, Setter } from "solid-js";
import TimeInput from "../atom/TimeInput";
import { HeureFormat } from "../organism/ClasseBoard";

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
    return {
      hour: Number(houre),
      minutes: Number(minute),
    };
  }

  function onInputStart(e: Event & { target: HTMLInputElement }) {
    const formatedSchedule = validateSchedule(e.target.value);
    if (!formatedSchedule) return;
    props.startSetter(formatedSchedule);
  }

  function onInputEnd(e: Event & { target: HTMLInputElement }) {
    const formatedSchedule = validateSchedule(e.target.value);
    if (!formatedSchedule) return;
    props.endSetter(formatedSchedule);
  }

  function value(schedule: HeureFormat | undefined) {
    if (schedule == undefined) return "";
    let houre = schedule.hour.toString();
    let minutes = schedule.minutes.toString();

    if (houre.length == 1) houre = "0" + houre;
    if (minutes.length == 1) minutes = "0" + minutes;
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
