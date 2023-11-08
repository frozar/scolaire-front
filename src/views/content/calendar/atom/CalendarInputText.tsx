import { Setter } from "solid-js";
import "./CalendarInputText.css";

interface CalendarInputTextProps {
  placeholder?: string;
  onInput: (value: string) => void;
  onKeyPress: (key: string) => void;
  ref?: Setter<HTMLInputElement>;
}

export function CalendarInputText(props: CalendarInputTextProps) {
  function onInput(event: Event & { target: HTMLInputElement }) {
    props.onInput(event.target.value);
  }

  function onKeyPress(event: KeyboardEvent) {
    const { key } = event;
    props.onKeyPress(key);
  }

  return (
    <input
      placeholder={props.placeholder ?? ""}
      class="calendar-input-name"
      onKeyPress={onKeyPress}
      onInput={onInput}
      ref={props.ref}
      type="text"
    />
  );
}
