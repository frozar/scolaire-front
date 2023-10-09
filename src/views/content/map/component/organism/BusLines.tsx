import L from "leaflet";
import { For, createEffect, createSignal, onCleanup } from "solid-js";
import { LineType } from "../../../../../_entities/line.entity";

import { BusLineService } from "../../../../../_services/line.service";
import { deselectAllCourses, setCourses } from "./Courses";
import { deselectAllPoints, pointsReady } from "./Points";

export const arrowsMap = new Map<number, L.Marker[]>();

export const [getLines, setLines] = createSignal<LineType[]>([]);

export function BusLines() {
  // eslint-disable-next-line solid/reactivity
  createEffect(async () => {
    if (pointsReady()) {
      const lines = await BusLineService.getAll();
      setLines(lines ?? []);
    }
  });
  // eslint-disable-next-line solid/reactivity
  createEffect(async () => {
    const courses = getLines()
      ?.map((line) => line.courses)
      .flatMap((e) => [...e]);

    setCourses(getSelectedLine()?.courses ?? courses);
  });

  onCleanup(() => {
    setLines([]);
  });

  const linesFilter = () => {
    return getLines();
  };

  return (
    <For each={linesFilter()}>
      {(line) => {
        return <div>{line.name}</div>;
      }}
    </For>
  );
}

export function deselectAllLines() {
  const deselectedLines = [...getLines()];
  deselectedLines.forEach((line) => line.setSelected(false));
  setLines(deselectedLines);

  deselectAllCourses();
  deselectAllPoints();
}

export const getSelectedLine = (): LineType | undefined => {
  const selectedLine = getLines().find((line) => line.selected());

  if (!selectedLine) {
    return;
  }

  return selectedLine;
};

export function updateBusLines(line: LineType) {
  let newBusLines = getLines();
  if (line.id) {
    newBusLines = getLines().filter((busline) => busline.id != line.id);
  }
  setLines([...newBusLines, line]);
}
