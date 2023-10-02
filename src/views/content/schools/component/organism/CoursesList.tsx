import { For } from "solid-js";
import { CourseType } from "../../../../../_entities/course.entity";
import CourseItem from "../molecule/CourseItem";
import "./CoursesList.css";

export default function (props: { lines: CourseType[] }) {
  return (
    <div class="school-details-line-list">
      <For each={props.lines}>{(item) => <CourseItem line={item} />}</For>
    </div>
  );
}
