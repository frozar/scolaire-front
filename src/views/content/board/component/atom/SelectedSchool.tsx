import { For } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import "./SelectedSchool.css";
import SelectedSchoolItem from "./SelectedSchoolItem";

interface SelectedSchoolProps {
  schoolSelected: SchoolType[];
}

export default function (props: SelectedSchoolProps) {
  const schoolSelected = () => props.schoolSelected;

  return (
    <div class="selected-school">
      {/* TODO remove title here & use BoardTitle above the component call */}
      <div class="add-line-information-board-content-title">
        <h1>Sélection des écoles</h1>
      </div>
      <For each={schoolSelected()}>
        {(school) => <SelectedSchoolItem school={school} />}
      </For>
    </div>
  );
}
