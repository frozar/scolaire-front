import TimeInput from "../atom/TimeInput";

interface TimeSchedulesInputProps {
  onInputStart: (value: string) => void;
  onInputEnd: (value: string) => void;
  startValue: string;
  endValue: string;
  disabled?: boolean;
}

export default function (props: TimeSchedulesInputProps) {
  return (
    <div class="flex gap-2">
      <TimeInput
        onInput={props.onInputStart}
        value={props.startValue}
        disabled={props.disabled}
      />
      <TimeInput
        onInput={props.onInputEnd}
        value={props.endValue}
        disabled={props.disabled}
      />
    </div>
  );
}
