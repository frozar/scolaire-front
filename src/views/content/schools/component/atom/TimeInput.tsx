interface TimeInputProps {
  value: string;
  onInput: (e: Event & { target: HTMLInputElement }) => void;
}

export default function (props: TimeInputProps) {
  return (
    <input
      value={props.value}
      name="start-time"
      type="time"
      onInput={props.onInput}
    />
  );
}
