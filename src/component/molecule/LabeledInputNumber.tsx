import InputNumber from "../../views/content/stops/component/atom/InputNumber";
import { QuantitySelectorType } from "../../views/content/stops/component/molecul/EditStudentSchoolGradeItem";

interface LabeledInputNumberProps {
  label: string;
  selector: QuantitySelectorType;
  onChange: (value: HTMLInputElement) => void;
}

export function LabeledInputNumber(props: LabeledInputNumberProps) {
  return (
    <div class="table my-2">
      <p>{props.label}</p>
      <InputNumber onChange={props.onChange} selector={props.selector} />
    </div>
  );
}
