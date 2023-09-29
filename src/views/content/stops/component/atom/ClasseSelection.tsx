import { Setter, For } from "solid-js";
import { ClasseType } from "../../../../../_entities/school.entity";

interface ClasseSelectProps {
  refSelectSetter: Setter<HTMLInputElement>;
  onChange: () => void;
  classes: ClasseType[];
  disabled?: boolean;
}

export default function (props: ClasseSelectProps) {
  return (
    <select disabled={props.disabled}>
      <option value="default">Selectionner une classe</option>
      <For each={props.classes}>
        {(classe) => <option value={classe.id}>{classe.classe}</option>}
      </For>
    </select>
  );
}
