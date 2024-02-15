import InputNumber from "../atom/InputNumber";
import { QuantitySelectorType } from "./EditStudentSchoolGradeItem";

interface WaitingTimeInputProps {
  selector: QuantitySelectorType;
  onChange: (element: HTMLInputElement) => void;
}

export function WaitingTimeInput(props: WaitingTimeInputProps) {
  return (
    <div class="table my-2">
      <p>Temps d'attente sur l'arrêt en seconde</p>
      <InputNumber onChange={props.onChange} selector={props.selector} />
    </div>
  );
}
