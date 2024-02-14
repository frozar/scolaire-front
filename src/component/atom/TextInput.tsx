import "./TextInput.css";

interface TextInputProps {
  onInput: (value: string) => void;
  placeholder?: string;
  defaultValue?: string;
  disabled?: boolean;
  class?: string;
}

export function TextInput(props: TextInputProps) {
  function onInput(event: Event & { target: HTMLInputElement }) {
    props.onInput(event.target.value);
  }

  return (
    <input
      type="text"
      onInput={onInput}
      class={"text-input " + props.class ?? ""}
      placeholder={props.placeholder}
      value={props.defaultValue ?? ""}
      disabled={props.disabled ? props.disabled : false}
    />
  );
}
