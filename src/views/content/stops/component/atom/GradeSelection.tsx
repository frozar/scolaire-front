import { For, Setter, onMount } from "solid-js";
import { GradeType } from "../../../../../_entities/grade.entity";
import "./GradeSelection.css";

interface GradeSelectProps {
  refSelectSetter: Setter<HTMLInputElement>;
  selectedOption: number;
  onChange: () => void;
  isModifying: boolean;
  grades: GradeType[];
}

export default function (props: GradeSelectProps) {
  onMount(() => {
    if (props.isModifying) {
      props.refSelectSetter((prev) => {
        const ref = prev;
        ref.disabled = true;
        return ref;
      });
    }
  });

  return (
    <select
      class="grade-selection"
      onChange={() => props.onChange()}
      ref={props.refSelectSetter}
    >
      <option value="default">Sélectionner une grade</option>
      <For each={props.grades}>
        {(grade) => (
          <option selected={grade.id == props.selectedOption} value={grade.id}>
            {grade.name}
          </option>
        )}
      </For>
    </select>
  );
}
