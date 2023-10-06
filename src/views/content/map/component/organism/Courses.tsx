import L from "leaflet";
import { For, createEffect, createSignal, onCleanup } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import { CourseType } from "../../../../../_entities/course.entity";
import { BusCourse } from "../molecule/Course";

import { CourseUtils } from "../../../../../utils/course.utils";
import {
  currentStep,
  drawModeStep,
} from "../../../board/component/organism/DrawModeBoardContent";
import { pointsReady } from "./Points";

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
  createEffect(async () => {
    if (pointsReady()) {
      await CourseUtils.set();
    }
  });

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
        return <BusCourse course={line} map={props.map} />;
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

  return selectedCourse;
};

export function updateBusCourses(course: CourseType) {
  let newBusCourses = getCourses();
  if (course.id) {
    newBusCourses = getCourses().filter(
      (buscourse) => buscourse.id != course.id
    );
  }
  setCourses([...newBusCourses, course]);
}
