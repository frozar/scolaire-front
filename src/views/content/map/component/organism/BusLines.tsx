import L from "leaflet";
import { For, createEffect, createSignal, onCleanup } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import { LineType } from "../../../../../_entities/line.entity";

import { BusLineService } from "../../../../../_services/line.service";
import { pointsReady } from "./Points";

const [, { getLineUnderConstruction }] = useStateAction();

export const arrowsMap = new Map<number, L.Marker[]>();

export const [getLines, setLines] = createSignal<LineType[]>([]);

export type BusLinesProps = {
  map: L.Map;
};

export function BusLines(props: BusLinesProps) {
  // eslint-disable-next-line solid/reactivity
  createEffect(async () => {
    if (pointsReady()) {
      const lines = await BusLineService.getAll();
      console.log(lines);
      setLines(lines ?? []);
    }
  });

  onCleanup(() => {
    setLines([]);
  });

  const linesFilter = () => {
    return getLines();
  };
  {
    /* <Line line={line} map={props.map} /> */
  }
  return (
    <For each={linesFilter()}>
      {(line) => {
        return <div>{line.name}</div>;
      }}
    </For>
  );
}

export function deselectAllLines() {
  getLines().map((line) => line.setSelected(false));
}

export const getSelectedLine = (): LinesType | undefined => {
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
