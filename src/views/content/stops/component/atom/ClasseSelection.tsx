import { For, Setter } from "solid-js";
import { ClasseType } from "../../../../../_entities/classe.entity";
import "./ClasseSelection.css";

interface ClasseSelectProps {
  refSelectSetter: Setter<HTMLInputElement>;
  onChange: () => void;
  classes: ClasseType[];
}

export default function (props: ClasseSelectProps) {
  return (
    <select
      class="class-selection"
      onChange={() => props.onChange()}
      ref={props.refSelectSetter}
    >
      <option selected value="default">
        Sélectionner une classe
      </option>
      <For each={props.classes}>
        {(classe) => <option value={classe.id}>{classe.name}</option>}
      </For>
    </select>
  );
}
