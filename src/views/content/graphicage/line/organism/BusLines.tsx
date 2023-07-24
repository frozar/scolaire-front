import { createEffect, createSignal, onCleanup } from "solid-js";
import { LineType } from "../../../../../type";
import { pointsReady } from "../../PointsRamassageAndEtablissement";
import { fetchBusLines } from "../busLinesUtils";

export const [busLines, setBusLines] = createSignal<LineType[]>([]);
export const [pickerColor, setPickerColor] = createSignal("");
export const linkBusLinePolyline: {
  [idBusLine: number]: {
    polyline: L.Polyline;
    arrows: L.Marker[];
  };
} = {};

export default function () {
  createEffect(() => {
    if (pointsReady()) {
      fetchBusLines();
    }
  });

  onCleanup(() => {
    setBusLines([]);
  });

  return <></>;
}
