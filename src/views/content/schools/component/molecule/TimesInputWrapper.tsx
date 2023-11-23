import { Accessor, Setter } from "solid-js";
import { HourFormat } from "../../../../../_entities/grade.entity";
import StartEndTimeSchedulesInput from "./StartEndTimeSchedulesInput";

interface TimesInputWrapper {
  startSetter: Setter<HourFormat>;
  start: Accessor<HourFormat | undefined>;
  endSetter: Setter<HourFormat>;
  end: Accessor<HourFormat | undefined>;
  label: string;
  disabled?: boolean;
}

export default function (props: TimesInputWrapper) {
  return (
    <div class="schedules-input my-5">
      <p>{props.label}</p>
      <StartEndTimeSchedulesInput
        startSetter={props.startSetter}
        start={props.start}
        endSetter={props.endSetter}
        end={props.end}
        disabled={props.disabled}
      />
    </div>
  );
}
