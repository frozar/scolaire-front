import { For } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import "./SchoolSelection.css";

interface SchoolSelectionProps {
  schools: SchoolType[];
  isModifying: boolean;
  selector: {
    value: number | string;
    disabled: boolean;
  };
  onChange: (element: HTMLSelectElement) => void;
}

export default function (props: SchoolSelectionProps) {
  return (
    <select
      name="school-select"
      onChange={(e) => props.onChange(e.target)}
      disabled={props.selector.disabled}
      class="school-selection"
    >
      <option value="default">Choisir une école</option>
      <For each={props.schools}>
        {(school) => (
          <option
            selected={school.id == props.selector.value}
            value={school.id}
          >
            {school.name}
          </option>
        )}
      </For>
    </select>
  );
}
