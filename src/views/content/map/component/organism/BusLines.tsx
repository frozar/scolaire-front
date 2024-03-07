import L from "leaflet";
import { createEffect, onCleanup } from "solid-js";
import { LineType } from "../../../../../_entities/line.entity";

import { LineStore, getLines } from "../../../../../_stores/line.store";
import { deselectAllPoints, pointsReady } from "./Points";
import { setTrips } from "./Trips";

export const arrowsMap = new Map<number, L.Marker[]>();

export function BusLines(props: { busLines: LineType[] }) {
  // eslint-disable-next-line solid/reactivity
  createEffect(async () => {
    if (pointsReady()) {
      LineStore.set(props.busLines);
    }
  });

  // eslint-disable-next-line solid/reactivity
  createEffect(async () => {
    setDisplayedTrips();
  });

  // TODO delete replace by displayedLines
  onCleanup(() => {
    // LineStore.set([]);
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
  LineStore.set(deselectedLines);

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
