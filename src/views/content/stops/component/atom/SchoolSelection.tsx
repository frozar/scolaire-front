import { For, Setter, onMount } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import "./SchoolSelection.css";

interface SchoolSelectionProps {
  schools: SchoolType[];
  isModifying: boolean;
  refSelectSetter: Setter<HTMLSelectElement>;
  onChange: () => void;
}

export default function (props: SchoolSelectionProps) {
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
      name="school-select"
      onChange={() => props.onChange()}
      ref={props.refSelectSetter}
      class="school-selection"
    >
      <option selected value="default">
        Choisir une école
      </option>
      <For each={props.schools}>
        {(school) => <option value={school.id}>{school.name}</option>}
      </For>
    </select>
  );
}
