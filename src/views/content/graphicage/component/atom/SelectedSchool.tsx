import { For, Show } from "solid-js";
import { PointInformation } from "./Point";
import "./SelectedSchool.css";

interface SelectedEtablissementProps {
  schoolSelected: PointInformation[];
}

export default function (props: SelectedEtablissementProps) {
  const schoolSelected = () => props.schoolSelected;

  return (
    <div class="selected-school">
      <Show
        when={schoolSelected().length > 0}
        fallback={<p>sélectionnez des établissements</p>}
      >
        <p>Etablissements sélectionnés:</p>
      </Show>
      <ul>
        <For each={schoolSelected()}>
          {(etablissement) => <li>{etablissement.name}</li>}
        </For>
      </ul>
    </div>
  );
}
