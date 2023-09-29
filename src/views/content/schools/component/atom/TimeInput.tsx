interface TimeInputProps {
  value: string;
  onInput: (value: string) => void;
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
      value={props.value}
      name="start-time"
      type="time"
      onFocusOut={onInput}
      onKeyPress={onInput}
    />
  );
}
