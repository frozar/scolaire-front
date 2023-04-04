import { onCleanup, createEffect } from "solid-js";
import L from "leaflet";

import { linkMap } from "./global/linkPointIdentityCircle";
import { getLeafletMap } from "./global/leafletMap";
import { Line } from "./type";
import { useStateAction } from "./StateAction";
import { ModeEnum } from "./type";
import { getRemoveConfirmation, setRemoveConfirmation } from "./signaux";

const [, { getMode }] = useStateAction();

export default function LineDisplay(props: any) {
  // Draw line circles/points
  const line: Line = props.line;

  let busLine: L.Polyline;
  const color = "#" + Math.floor(Math.random() * 0xffffff).toString(16);

  createEffect(() => {
    // Take care of undo/redo
    busLine?.remove();

    const latlngs = [];
    for (const pointIdentity of line.stops) {
      const circle = linkMap.get(pointIdentity!);
      if (circle) {
        latlngs.push(circle.getLatLng());
      }
    }

    busLine = L.polyline(latlngs, {
      color: color,
    })
      .addTo(getLeafletMap())
      .on("mouseover", () => {
        if (getMode() === ModeEnum.removeLine) {
          console.log("mouseover", line);
          busLine.setStyle({ color: "#FFF", weight: 8 });
        }
      })
      .on("mouseout", () => {
        if (getMode() === ModeEnum.removeLine) {
          busLine.setStyle({ color: color, weight: 2 });
        }
      })
      .on("click", () => {
        if (getMode() === ModeEnum.removeLine) {
          console.log("mouseclick", line);
          setRemoveConfirmation({
            displayed: true,
            id_bus_line: line["id_bus_line"],
          });
          console.log("getRemoveConfirmation()", getRemoveConfirmation());
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
