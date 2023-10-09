import { For, Setter } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";

interface SchoolSelectionProps {
  schools: SchoolType[];
  refSelectSetter: Setter<HTMLSelectElement>;
  onChange: () => void;
}

export default function (props: SchoolSelectionProps) {
  return (
    <select
      name="school-select"
      onChange={() => props.onChange()}
      ref={props.refSelectSetter}
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
