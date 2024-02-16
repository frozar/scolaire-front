import "./InputTitle.css";

interface InputTitleProps {
  disabled: boolean;
  defaultValue: string;
  onInput: (value: string) => void;
  active: boolean;
}

export function InputTitle(props: InputTitleProps) {
  return (
    <input
      type="text"
      class="input-title"
      classList={{
        active: props.active,
      }}
      value={props.defaultValue}
      disabled={props.disabled}
      onInput={(element) => props.onInput(element.target.value)}
    />
  );
}
