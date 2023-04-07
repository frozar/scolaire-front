import { onCleanup, createEffect } from "solid-js";
import L from "leaflet";

import { linkMap } from "./global/linkPointIdentityCircle";
import { getLeafletMap } from "./global/leafletMap";
import { Line } from "./type";
import { useStateAction } from "./StateAction";
import { setRemoveConfirmation } from "./signaux";

const [, { isInRemoveLineMode, isLineUnderConstruction }] = useStateAction();

export default function LineDisplay(props: any) {
  // Draw line circles/points
  const line: Line = props.line;

  let busLine: L.Polyline;
  const randomColor = "#" + Math.floor(Math.random() * 0xffffff).toString(16);

  createEffect(() => {
    // Take care of undo/redo
    busLine?.remove();

    const color = isLineUnderConstruction(line) ? "#0000FF" : randomColor;

    const latlngs = [];
    for (const pointIdentity of line.stops) {
      const circle = linkMap.get(pointIdentity.id_point);
      if (circle) {
        latlngs.push(circle.getLatLng());
      }
    }

    busLine = L.polyline(latlngs, {
      color: color,
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
