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
    <div class="flex justify-between w-[70%]">
      <TimeInput
        onInput={props.onInputStart}
        value={props.startValue}
        disabled={props.disabled}
      />

      <p>à</p>
      <TimeInput
        onInput={props.onInputEnd}
        value={props.endValue}
        disabled={props.disabled}
      />
    </div>
  );
}
