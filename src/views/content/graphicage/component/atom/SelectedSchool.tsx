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
      <For each={schoolSelected()}>
        {(etablissement) => {
          return <SelectedSchoolItem etablissement={etablissement} />;
        }}
      </For>
    </div>
  );
}
