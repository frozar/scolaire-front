import { For, Setter } from "solid-js";
import { GradeType } from "../../../../../_entities/grade.entity";
import "./GradeSelection.css";

interface GradeSelectProps {
  refSelectSetter: Setter<HTMLInputElement>;
  onChange: () => void;
  grades: GradeType[];
}

export default function (props: GradeSelectProps) {
  return (
    <select
      class="grade-selection"
      onChange={() => props.onChange()}
      ref={props.refSelectSetter}
    >
      <option selected value="default">
        Sélectionner une grade
      </option>
      <For each={props.grades}>
        {(grade) => <option value={grade.id}>{grade.name}</option>}
      </For>
    </select>
  );
}
