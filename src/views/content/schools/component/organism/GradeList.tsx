import { For } from "solid-js";
import { GradeType } from "../../../../../_entities/grade.entity";
import GradeItem from "../molecule/GradeItem";

export default function (props: { grades: GradeType[] }) {
  return (
    <div class="school-details-grade-list">
      <For each={props.grades}>
        {(item) => <GradeItem NbStudents={0} grade={item} />}
      </For>
    </div>
  );
}
