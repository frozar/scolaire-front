import { GradeEntity, HourFormat } from "../../../../../_entities/grade.entity";
import StartEndTimeSchedulesInput from "./StartEndTimeSchedulesInput";

import "./TimesInputWrapper.css";

interface TimesInputWrapper {
  onInputStart: (value: string) => void;
  onInputEnd: (value: string) => void;
  startValue: HourFormat | null | undefined;
  endValue: HourFormat | null | undefined;
  label: string;
  disabled?: boolean;
}

function hourValue(value: HourFormat | null | undefined) {
  return value ? GradeEntity.getStringFromHourFormat(value) : "--";
}

export default function (props: TimesInputWrapper) {
  return (
    <div class="schedules-input">
      <p>{props.label}</p>
      <StartEndTimeSchedulesInput
        onInputStart={props.onInputStart}
        onInputEnd={props.onInputEnd}
        startValue={hourValue(props.startValue)}
        endValue={hourValue(props.endValue)}
        disabled={props.disabled}
      />
    </div>
  );
}
