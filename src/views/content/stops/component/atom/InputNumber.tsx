import "./InputNumber.css";

interface InputNumberProps {
  // ! Use specific type
  selector: {
    value: number;
    disabled: boolean;
  };
  onChange: (element: HTMLInputElement) => void;
  min?: number;
  defaultValue?: number; // ! use selector.value instead !?
  placeholder?: string;
  class?: string;
}

export default function (props: InputNumberProps) {
  return (
    <input
      disabled={props.selector.disabled}
      class={"number-input " + (props.class ? props.class : "")}
      min={props.min ? props.min : 0}
      value={props.defaultValue ? props.defaultValue : 0}
      type="number"
      onChange={(e) => props.onChange(e.target)}
      placeholder={props.placeholder ? props.placeholder : "Entrer un nombre"}
    />
  );
}
