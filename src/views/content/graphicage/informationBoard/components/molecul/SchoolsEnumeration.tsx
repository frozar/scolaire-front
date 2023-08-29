import { For } from "solid-js";
import "./SchoolsEnumeration.css";

export default function (props: { schoolsName: string[] }) {
  return (
    <>
      <p>Ecoles</p>
      <p class="edit-mode-school-item">
        <For each={props.schoolsName}>
          {(school) => {
            return <>{school}</>;
          }}
        </For>
      </p>
    </>
  );
}
