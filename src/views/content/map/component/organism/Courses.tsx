import L from "leaflet";
import { For, createSignal, onCleanup } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import { CourseType } from "../../../../../_entities/course.entity";
import { Course } from "../molecule/Course";

import {
  currentStep,
  drawModeStep,
} from "../../../board/component/organism/DrawModeBoardContent";

const [, { getCourseUnderConstruction }] = useStateAction();

export const arrowsMap = new Map<number, L.Marker[]>();

export type leafletBusCourseType = {
  polyline: L.Polyline;
  arrows: L.Marker[];
};

export const [getCourses, setCourses] = createSignal<CourseType[]>([]);

export type BusCoursesProps = {
  map: L.Map;
};

export function BusCourses(props: BusCoursesProps) {
  // eslint-disable-next-line solid/reactivity

  onCleanup(() => {
    setCourses([]);
  });

  const coursesFilter = () => {
    if (currentStep() > drawModeStep.start) {
      // delete all arrows
      arrowsMap.forEach((arrows) =>
        arrows.map((arrow) => props.map.removeLayer(arrow))
      );
      arrowsMap.clear();

      return [getCourseUnderConstruction().course];
    }
    return getCourses();
  };

  return (
    <For each={coursesFilter()}>
      {(line) => {
        return <Course course={line} map={props.map} />;
      }}
    </For>
  );
}

export function deselectAllCourses() {
  getCourses().map((course) => course.setSelected(false));
}

export const getSelectedCourse = (): CourseType | undefined => {
  const selectedCourse = getCourses().find((line) => line.selected());

  if (!selectedCourse) {
    return;
  }
  console.log("getCourses", getCourses());

  return selectedCourse;
};

export function updateBusCourses(courses: CourseType[]) {
  // let newBusCourses = getCourses();
  // if (course.id) {
  //   newBusCourses = getCourses().filter(
  //     (buscourse) => buscourse.id != course.id
  //   );
  // }
  setCourses(courses);
}
