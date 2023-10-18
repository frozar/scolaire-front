import L from "leaflet";
import { For, createEffect, createSignal, onCleanup } from "solid-js";
import { LineType } from "../../../../../_entities/line.entity";

import { deselectAllPoints, pointsReady } from "./Points";
import { setRaces } from "./Races";

export const arrowsMap = new Map<number, L.Marker[]>();

export const [getLines, setLines] = createSignal<LineType[]>([]);

export function BusLines(props: { busLines: LineType[] }) {
  // eslint-disable-next-line solid/reactivity
  createEffect(async () => {
    if (pointsReady()) {
      setLines(props.busLines);
    }
  });

  createEffect(() => {
    console.log("getLines() createEffect", getLines());
  });

  // eslint-disable-next-line solid/reactivity
  createEffect(async () => {
    setDisplayedRaces();
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

function setDisplayedRaces() {
  const allRaces = getLines()
    ?.map((line) => line.courses)
    .flatMap((e) => [...e]);

  //TODO to fix race
  setRaces(getSelectedLine()?.courses ?? allRaces);
}

export function deselectAllLines() {
  const deselectedLines = [...getLines()];
  deselectedLines.forEach((line) => line.setSelected(false));
  setLines(deselectedLines);

  // TODO to fix race
  // deselectAllRaces();
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
