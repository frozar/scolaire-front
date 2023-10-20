import { For, Setter } from "solid-js";
import { GradeType } from "../../../../../_entities/grade.entity";
import "./GradeSelection.css";

interface GradeSelectProps {
  refSelectSetter: Setter<HTMLInputElement>;
  onChange: () => void;
  classes: GradeType[];
}

export default function (props: GradeSelectProps) {
  return (
    <select
      class="class-selection"
      onChange={() => props.onChange()}
      ref={props.refSelectSetter}
    >
      <option selected value="default">
        Sélectionner une grade
      </option>
      <For each={props.classes}>
        {(grade) => <option value={grade.id}>{grade.name}</option>}
      </For>
    </select>
  );
}
