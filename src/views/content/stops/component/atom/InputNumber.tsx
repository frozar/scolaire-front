import { Setter } from "solid-js";
import "./InputNumber.css";

interface InputNumberProps {
  ref: Setter<HTMLInputElement>;
  min?: number;
  defaultValue?: number;
  placeholder?: string;
  class?: string;
}

export default function (props: InputNumberProps) {
  return (
    <input
      ref={props.ref}
      class={"number-input " + (props.class ? props.class : "")}
      min={props.min ? props.min : 0}
      value={props.defaultValue ? props.defaultValue : 0}
      type="number"
      placeholder={props.placeholder ? props.placeholder : "Entrer un nombre"}
    />
  );
}
