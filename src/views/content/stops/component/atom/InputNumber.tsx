import "./InputNumber.css";

interface InputNumberProps {
  // ref: Setter<HTMLInputElement>;
  selector: {
    value: number;
    disabled: boolean;
  };
  onChange: (element: HTMLInputElement) => void;
  min?: number;
  defaultValue?: number;
  placeholder?: string;
  class?: string;
}

export default function (props: InputNumberProps) {
  return (
    <input
      // ref={props.ref}
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
