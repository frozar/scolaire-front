import { For } from "solid-js";
import { GradeType } from "../../../../../_entities/grade.entity";
import { SelectorType } from "../molecul/EditStudentSchoolGradeItem";
import "./GradeSelection.css";

interface GradeSelectProps {
  selector: SelectorType;
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
          <option
            selected={grade.id == Number(props.selector.value)}
            value={grade.id}
          >
            {grade.name}
          </option>
        )}
      </For>
    </select>
  );
}
