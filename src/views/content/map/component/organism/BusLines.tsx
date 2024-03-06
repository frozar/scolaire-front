import L from "leaflet";
import { createEffect, onCleanup } from "solid-js";
import { LineType } from "../../../../../_entities/line.entity";

import { deselectAllPoints, pointsReady } from "./Points";
import { setTrips } from "./Trips";
import { getLines, setLines } from "../../../../../_stores/line.store";

export const arrowsMap = new Map<number, L.Marker[]>();

// export const [getLines, setLines] = createSignal<LineType[]>([]);

export function BusLines(props: { busLines: LineType[] }) {
  // eslint-disable-next-line solid/reactivity
  createEffect(async () => {
    if (pointsReady()) {
      setLines(props.busLines);
    }
  });

  // eslint-disable-next-line solid/reactivity
  createEffect(async () => {
    setDisplayedTrips();
  });

  onCleanup(() => {
    setLines([]);
  });

  return <></>;
}

function setDisplayedTrips() {
  const allTrips = getLines()
    ?.map((line) => line.trips)
    .flat();

  //TODO to fix trip
  setTrips(getSelectedLine()?.trips ?? allTrips);
}

export function deselectAllLines() {
  const deselectedLines = [...getLines()];
  deselectedLines.forEach((line) => line.setSelected(false));
  setLines(deselectedLines);

  // TODO to fix trip
  // deselectAllTrips();
  deselectAllPoints();
}

export const getSelectedLine = (): LineType | undefined => {
  const selectedLine = getLines().find((line) => line.selected());

  if (!selectedLine) {
    return;
  }

  return selectedLine;
};

// export const setSelectedLine = (newBusLine: LineType) => {
//   deselectAllLines();
//   newBusLine.setSelected(true);
// };

export function updateBusLines(line: LineType) {
  let newBusLines = getLines();
  if (line.id) {
    newBusLines = getLines().filter((busline) => busline.id != line.id);
  }
  setLines([...newBusLines, line]);
}
