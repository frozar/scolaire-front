import { For } from "solid-js";
import "./GradeLinkedSchool.css";

interface GradeLinkedSchoolProps {
  schools: string[];
}

export default function (props: GradeLinkedSchoolProps) {
  return (
    <div class="linked-schools-item">
      <For each={props.schools}>{(school) => <p>{school}</p>}</For>
    </div>
  );
}
