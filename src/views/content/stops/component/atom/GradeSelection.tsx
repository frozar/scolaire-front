import { For } from "solid-js";
import { GradeType } from "../../../../../_entities/grade.entity";
import "./GradeSelection.css";

interface GradeSelectProps {
  selector: {
    value: number | string; // ! Change
    disabled: boolean;
  };
  onChange: (element: HTMLSelectElement) => void;
  isModifying: boolean;
  grades: GradeType[];
}

export default function (props: GradeSelectProps) {
  return (
    <select
      class="grade-selection"
      onChange={(e) => props.onChange(e.target)}
      disabled={props.selector.disabled}
    >
      <option value="default">Sélectionner une grade</option>
      <For each={props.grades}>
        {(grade) => (
          <option selected={grade.id == props.selector.value} value={grade.id}>
            {grade.name}
          </option>
        )}
      </For>
    </select>
  );
}
