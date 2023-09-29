import { Accessor, Setter } from "solid-js";
import { HeureFormat } from "../organism/ClasseBoard";
import StartEndTimeSchedulesInput from "./StartEndTimeSchedulesInput";

interface TimesInputWrapper {
  startSetter: Setter<HeureFormat>;
  start: Accessor<HeureFormat | undefined>;
  endSetter: Setter<HeureFormat>;
  end: Accessor<HeureFormat | undefined>;
  label: string;
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
      />
    </div>
  );
}
