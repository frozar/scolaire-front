import { For, Setter, onMount } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import "./SchoolSelection.css";

interface SchoolSelectionProps {
  schools: SchoolType[];
  isModifying: boolean;
  selectedOption: number;
  refSelectSetter: Setter<HTMLSelectElement>;
  onChange: () => void;
}

export default function (props: SchoolSelectionProps) {
  onMount(() => {
    if (props.isModifying) {
      console.log("selected option");
      props.refSelectSetter((prev) => {
        const ref = prev;
        ref.disabled = true;
        return ref;
      });
    } else {
      props.refSelectSetter((prev) => {
        const ref = prev;
        ref.value = "default";
        return ref;
      });
    }
  });

  return (
    <select
      name="school-select"
      onChange={() => props.onChange()}
      // onChange={(e) => onChangeSchoolSelect(e.target)}
      ref={props.refSelectSetter}
      class="school-selection"
    >
      <option value="default">Choisir une école</option>
      <For each={props.schools}>
        {(school) => (
          <option
            selected={school.id == props.selectedOption}
            value={school.id}
          >
            {school.name}
          </option>
        )}
      </For>
    </select>
  );
}
