import { For } from "solid-js";
import "./SchoolsEnumeration.css";

export interface SchoolsEnumerationProps {
  schoolsName: string[];
}
export default function (props: SchoolsEnumerationProps) {
  return (
    <div class="edit-mode-school">
      {/* // TODO maybe externalise title in atom folder ? */}
      <p class="edit-mode-school-title">Ecoles :</p>
      <div>
        <For each={props.schoolsName}>
          {(school) => {
            return <p class="edit-mode-school-item">{school + " "}</p>;
          }}
        </For>
      </div>
    </div>
  );
}
