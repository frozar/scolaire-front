import { For } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import "./SelectedSchool.css";
import SelectedSchoolItem from "./SelectedSchoolItem";

interface SelectedEtablissementProps {
  schoolSelected: SchoolType[];
}

export default function (props: SelectedEtablissementProps) {
  const schoolSelected = () => props.schoolSelected;

  return (
    <div class="selected-school">
      <div class="add-line-information-board-content-title">
        <h1>Sélection des écoles</h1>
      </div>
      <For each={schoolSelected()}>
        {(etablissement) => {
          return <SelectedSchoolItem etablissement={etablissement} />;
        }}
      </For>
    </div>
  );
}
