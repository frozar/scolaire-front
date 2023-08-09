import L from "leaflet";
import { For, createEffect, createSignal, onCleanup } from "solid-js";
import { BusLineType } from "../../../../_entities/bus-line.entity";
import { BusLineService } from "../../../../_services/bus-line.service";
import { LineType } from "../../../../type";
import { BusLine } from "../component/molecule/BusLine";
import { pointsReady } from "../component/organism/Points";

export const [busLinesOld, setBusLinesOld] = createSignal<LineType[]>([]);
export const [pickerColor, setPickerColor] = createSignal("");
export const linkBusLinePolyline: {
  [idBusLine: number]: {
    polyline: L.Polyline;
    arrows: L.Marker[];
  };
} = {};

export const [getBusLines, setBusLines] = createSignal<BusLineType[]>([]);

export type BusLinesProps = {
  map: L.Map;
};

export function BusLines(props: BusLinesProps) {
  createEffect(async () => {
    if (pointsReady()) {
      const lines = await BusLineService.getAll();

      setBusLines(lines);

      //TODO to delete
      // fetchBusLines();
    }
  });

  onCleanup(() => {
    setBusLines([]);
    setBusLinesOld([]);
  });

  return (
    <For each={getBusLines()}>
      {(line) => {
        return <BusLine line={line} map={props.map} />;
      }}
    </For>
  );
}

const busLinesFilter = () => {
  return getBusLines();
};
