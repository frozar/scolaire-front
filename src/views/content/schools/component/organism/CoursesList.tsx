import { For } from "solid-js";
import { BusCourseType } from "../../../../../_entities/bus-course.entity";
import CourseItem from "../molecule/CourseItem";
import "./CoursesList.css";

export default function (props: { lines: BusCourseType[] }) {
  return (
    <div class="school-details-line-list">
      <For each={props.lines}>{(item) => <CourseItem line={item} />}</For>
    </div>
  );
}
