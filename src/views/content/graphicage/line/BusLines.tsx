import L from "leaflet";
import { For, createEffect, createSignal, onCleanup } from "solid-js";
import { BusLineType } from "../../../../_entities/bus-line.entity";
import { BusLineService } from "../../../../_services/bus-line.service";
import { BusLine } from "../component/molecule/BusLine";
import { pointsReady } from "../component/organism/Points";

export type leafletBusLineType = {
  polyline: L.Polyline;
  arrows: L.Marker[];
};

export const [getBusLines, setBusLines] = createSignal<BusLineType[]>([]);

export type BusLinesProps = {
  map: L.Map;
};

export function BusLines(props: BusLinesProps) {
  createEffect(async () => {
    if (pointsReady()) {
      const lines = await BusLineService.getAll();
      setBusLines(lines);
    }
  });

  onCleanup(() => {
    setBusLines([]);
  });

  return (
    <For each={busLinesFilter()}>
      {(line) => {
        return <BusLine line={line} map={props.map} />;
      }}
    </For>
  );
}

const busLinesFilter = () => {
  return getBusLines();
};

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
