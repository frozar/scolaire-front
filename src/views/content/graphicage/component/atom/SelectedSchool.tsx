import { For } from "solid-js";
import { PointInformation } from "./Point";
import "./SelectedSchool.css";
import SelectedSchoolItem from "./SelectedSchoolItem";

interface SelectedEtablissementProps {
  schoolSelected: PointInformation[];
}

export default function (props: SelectedEtablissementProps) {
  const schoolSelected = () => props.schoolSelected;

  return (
    <div class="selected-school">
      {/* <Show
        when={schoolSelected().length > 0}
        fallback={<p>Sélectionnez des établissements</p>}
      >
        <p>Etablissements sélectionnés:</p>
      </Show> */}
      <For each={schoolSelected()}>
        {(etablissement) => {
          return <SelectedSchoolItem etablissement={etablissement} />;
        }}
      </For>
    </div>
  );
}
