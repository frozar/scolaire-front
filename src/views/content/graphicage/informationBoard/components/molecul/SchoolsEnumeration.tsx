import { For } from "solid-js";
import "./SchoolsEnumeration.css";

export interface SchoolsEnumerationProps {
  schoolsName: string[];
}
export default function (props: SchoolsEnumerationProps) {
  return (
    <div class="edit-mode-school">
      {/* // TODO maybe externalise title in atom folder ? */}
      <p>Ecoles</p>
      <p class="edit-mode-school-item">
        <For each={props.schoolsName}>
          {(school) => {
            return <>{school + " "}</>;
          }}
        </For>
      </p>
    </div>
  );
}
