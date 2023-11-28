import StartEndTimeSchedulesInput from "./StartEndTimeSchedulesInput";

import "./TimesInputWrapper.css";

interface TimesInputWrapper {
  onInputStart: (value: string) => void;
  onInputEnd: (value: string) => void;
  startValue: string;
  endValue: string;
  label: string;
  disabled?: boolean;
}

export default function (props: TimesInputWrapper) {
  return (
    <div class="schedules-input">
      <p>{props.label}</p>
      <StartEndTimeSchedulesInput
        onInputStart={props.onInputStart}
        onInputEnd={props.onInputEnd}
        startValue={props.startValue}
        endValue={props.endValue}
        disabled={props.disabled}
      />
    </div>
  );
}
