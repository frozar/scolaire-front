import { onCleanup, createEffect, createSignal } from "solid-js";
import { pointsReady } from "../../../../views/content/graphicage/PointsRamassageAndEtablissement";
import { fetchBusLines } from "./busLinesUtils";
import { LineType } from "../../../../type";

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
