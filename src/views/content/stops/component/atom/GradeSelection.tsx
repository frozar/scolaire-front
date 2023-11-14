import { For } from "solid-js";
import { GradeType } from "../../../../../_entities/grade.entity";
import "./GradeSelection.css";

interface GradeSelectProps {
  // refSelectSetter: Setter<HTMLInputElement>;
  // selectedOption: number;
  selector: {
    value: number | string;
    disabled: boolean;
  };
  onChange: (element: HTMLSelectElement) => void;
  isModifying: boolean;
  grades: GradeType[];
}

export default function (props: GradeSelectProps) {
  // onMount(() => {
  //   if (props.isModifying) {
  //     props.refSelectSetter((prev) => {
  //       const ref = prev;
  //       ref.disabled = true;
  //       return ref;
  //     });
  //   }
  // });

  return (
    <select
      class="grade-selection"
      onChange={(e) => props.onChange(e.target)}
      // ref={props.refSelectSetter}
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
