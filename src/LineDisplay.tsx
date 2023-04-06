import { onCleanup, createEffect, createSignal } from "solid-js";
import L from "leaflet";

import { linkMap } from "./global/linkPointIdentityCircle";
import { getLeafletMap } from "./global/leafletMap";
import { Line } from "./type";
import { useStateAction } from "./StateAction";
import { setRemoveConfirmation } from "./signaux";

const [, { isInRemoveLineMode, getMode }] = useStateAction();
const [stateAction] = useStateAction();

export default function LineDisplay(props: any) {
  // Draw line circles/points
  const line: Line = props.line;

  let busLine: L.Polyline;
  console.log("New Line ", props.line);

  const color_alea = "#" + Math.floor(Math.random() * 0xffffff).toString(16);
  const [color, setcolor] = createSignal<string>(color_alea);
  createEffect(() => {
    // Take care of undo/redo
    busLine?.remove();
    console.log("Update");
    setcolor(
      line === stateAction.lineUnderConstruction ? "#0000FF" : color_alea
    );
    console.log(
      "line === stateAction.lineUnderConstruction ",
      line === stateAction.lineUnderConstruction
    );
    console.log("line ", line);
    console.log(
      "stateAction.lineUnderConstruction ",
      stateAction.lineUnderConstruction
    );
    const latlngs = [];
    for (const pointIdentity of line.stops) {
      const circle = linkMap.get(pointIdentity.id_point);
      if (circle) {
        latlngs.push(circle.getLatLng());
      }
    }
    busLine = L.polyline(latlngs, {
      color: color(),
    })
      .addTo(getLeafletMap())
      .on("mouseover", () => {
        createEffect(() => {
          if (!isInRemoveLineMode()) {
            busLine.setStyle({ color: color, weight: 3 });
          }
        });
        if (isInRemoveLineMode()) {
          busLine.setStyle({ color: "#FFF", weight: 8 });
        }
      })
      .on("mouseout", () => {
        if (isInRemoveLineMode()) {
          busLine.setStyle({ color: color, weight: 3 });
        }
      })
      .on("click", () => {
        if (isInRemoveLineMode()) {
          setRemoveConfirmation({
            displayed: true,
            id_bus_line: line["id_bus_line"],
          });
        }
      });
  });

  onCleanup(() => {
    busLine.remove();
    const leafletMap = getLeafletMap();
    if (!leafletMap) {
      return;
    }
  });

  return <></>;
}
