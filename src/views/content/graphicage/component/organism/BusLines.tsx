import L from "leaflet";
import { For, createEffect, createSignal, onCleanup } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import { BusLineType } from "../../../../../_entities/bus-line.entity";
import { BusLineService } from "../../../../../_services/bus-line.service";
import { COLOR_LINE_EDITION } from "../../constant";
import { BusLine } from "../molecule/BusLine";
import { currentStep, drawModeStep } from "./DrawModeBoardContent";

import { pointsReady } from "./Points";

const [, { getLineUnderConstruction }] = useStateAction();

export const arrowsMap = new Map<number, L.Marker[]>();

export type leafletBusLineType = {
  polyline: L.Polyline;
  arrows: L.Marker[];
};

export const [getBusLines, setBusLines] = createSignal<BusLineType[]>([]);

export type BusLinesProps = {
  map: L.Map;
};

export function BusLines(props: BusLinesProps) {
  // eslint-disable-next-line solid/reactivity
  createEffect(async () => {
    if (pointsReady()) {
      const lines = await BusLineService.getAll();
      setBusLines(lines);
    }
  });

  onCleanup(() => {
    setBusLines([]);
  });

  const busLinesFilter = () => {
    if (currentStep() > drawModeStep.start) {
      // delete all arrows
      arrowsMap.forEach((arrows) =>
        arrows.map((arrow) => props.map.removeLayer(arrow))
      );
      arrowsMap.clear();
      getLineUnderConstruction().busLine.setColor(COLOR_LINE_EDITION);
      return [getLineUnderConstruction().busLine];
    }
    return getBusLines();
  };

  return (
    <For each={busLinesFilter()}>
      {(line) => {
        return <BusLine line={line} map={props.map} />;
      }}
    </For>
  );
}

export function deselectAllBusLines() {
  getBusLines().map((busLine) => busLine.setSelected(false));
}

export const getSelectedBusLine = (): BusLineType | undefined => {
  const selectedBusLine = getBusLines().find((line) => line.selected());

  if (!selectedBusLine) {
    return;
  }

  return selectedBusLine;
};

export function updateBusLines(busLine: BusLineType) {
  setBusLines((busLines) => {
    if (busLine.id) {
      busLines = busLines.filter((busline) => busline.id == busLine.id);
    }
    busLines.push(busLine);
    return busLines;
  });
}
