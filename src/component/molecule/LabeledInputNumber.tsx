import InputNumber from "../../views/content/stops/component/atom/InputNumber";
import { QuantitySelectorType } from "../../views/content/stops/component/molecul/EditStudentSchoolGradeItem";

export function LabeledInputNumber(props: {
  label: string;
  selector: QuantitySelectorType;
  onChange: (value: HTMLInputElement) => void;
  max?: number;
  min?: number;
}) {
  return (
    <div class="table my-2">
      <p>{props.label}</p>
      <InputNumber
        onChange={props.onChange}
        selector={props.selector}
        min={props.min}
      />
    </div>
  );
}
