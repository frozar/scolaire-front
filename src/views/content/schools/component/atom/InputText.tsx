import "./InputText.css";

interface InputTextProps {
  name?: string;
  placeholder?: string;
  onInput: (value: string) => void;
}

export default function (props: InputTextProps) {
  return (
    <input
      class="input"
      type="text"
      name={props.name}
      placeholder={props.placeholder}
      onInput={({ target }) => props.onInput(target.value)}
    />
  );
}
