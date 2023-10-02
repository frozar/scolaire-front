import L from "leaflet";
import { For, createEffect, createSignal, onCleanup } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import { BusCourseType } from "../../../../../_entities/bus-course.entity";
import { BusCourseService } from "../../../../../_services/bus-course.service";
import { BusCourse } from "../molecule/BusCourse";

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

export const [getBusCourses, setBusCourses] = createSignal<BusCourseType[]>([]);

export type BusCoursesProps = {
  map: L.Map;
};

export function BusCourses(props: BusCoursesProps) {
  // eslint-disable-next-line solid/reactivity
  createEffect(async () => {
    if (pointsReady()) {
      const lines = await BusCourseService.getAll();
      setBusCourses(lines);
    }
  });

  onCleanup(() => {
    setBusCourses([]);
  });

  const busCoursesFilter = () => {
    if (currentStep() > drawModeStep.start) {
      // delete all arrows
      arrowsMap.forEach((arrows) =>
        arrows.map((arrow) => props.map.removeLayer(arrow))
      );
      arrowsMap.clear();

      return [getCourseUnderConstruction().busCourse];
    }
    return getBusCourses();
  };

  return (
    <For each={busCoursesFilter()}>
      {(line) => {
        return <BusCourse course={line} map={props.map} />;
      }}
    </For>
  );
}

export function deselectAllBusCourses() {
  getBusCourses().map((busCourse) => busCourse.setSelected(false));
}

export const getSelectedBusCourse = (): BusCourseType | undefined => {
  const selectedBusCourse = getBusCourses().find((line) => line.selected());

  if (!selectedBusCourse) {
    return;
  }

  return selectedBusCourse;
};

export function updateBusCourses(busCourse: BusCourseType) {
  let newBusCourses = getBusCourses();
  if (busCourse.id) {
    newBusCourses = getBusCourses().filter(
      (buscourse) => buscourse.id != busCourse.id
    );
  }
  setBusCourses([...newBusCourses, busCourse]);
}
