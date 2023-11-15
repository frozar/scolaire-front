import { QuantitySelectorType } from "../molecul/EditStudentSchoolGradeItem";
import "./InputNumber.css";

interface InputNumberProps {
  selector: QuantitySelectorType;
  onChange: (element: HTMLInputElement) => void;
  min?: number;
  placeholder?: string;
  class?: string;
}

export default function (props: InputNumberProps) {
  return (
    <input
      disabled={props.selector.disabled}
      class={"number-input " + (props.class ? props.class : "")}
      min={props.min ? props.min : 0}
      value={props.selector.value}
      type="number"
      onChange={(e) => props.onChange(e.target)}
      placeholder={props.placeholder ? props.placeholder : "Entrer un nombre"}
    />
  );
}
