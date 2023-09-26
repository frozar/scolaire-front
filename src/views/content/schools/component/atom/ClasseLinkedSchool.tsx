import { For } from "solid-js";
import "./ClasseLinkedSchool.css";

interface ClasseLinkedSchoolProps {
  schools: string[];
}

export default function (props: ClasseLinkedSchoolProps) {
  return (
    <div class="linked-schools-item">
      <For each={props.schools}>{(school) => <p>{school}</p>}</For>
    </div>
  );
}
