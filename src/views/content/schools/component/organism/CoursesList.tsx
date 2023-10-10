import { For } from "solid-js";
import { CourseType } from "../../../../../_entities/course.entity";
import CourseItem from "../molecule/CourseItem";
import "./CoursesList.css";

export default function (props: { courses: CourseType[] }) {
  return (
    <div class="school-details-line-list">
      <For each={props.courses}>{(item) => <CourseItem line={item} />}</For>
    </div>
  );
}
