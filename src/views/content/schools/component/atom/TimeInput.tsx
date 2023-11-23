import "./TimeInput.css";

interface TimeInputProps {
  value: string;
  onInput: (value: string) => void;
  disable?: boolean;
}

export default function (props: TimeInputProps) {
  function onInput(
    event: (Event & { target: HTMLInputElement }) | KeyboardEvent
  ) {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    if (event instanceof KeyboardEvent) {
      if (event.key == "Enter") props.onInput(target.value);
    } else {
      props.onInput(target.value);
    }
  }

  return (
    <input
      type="time"
      class="time-input"
      value={props.value}
      onFocusOut={onInput}
      onKeyPress={onInput}
      disabled={props.disable ? props.disable : false}
    />
  );
}
