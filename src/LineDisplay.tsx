import { onCleanup, createEffect } from "solid-js";
import L from "leaflet";

import { linkMap } from "./global/linkPointIdentityCircle";
import { getLeafletMap } from "./global/leafletMap";
import { Line } from "./type";
import { useStateAction } from "./StateAction";
import { setRemoveConfirmation } from "./signaux";
import { unwrap } from "solid-js/store";
import { COLOR_LINE_UNDER_CONSTRUCTION } from "./constant";

const [, { isInRemoveLineMode, isLineUnderConstruction }] = useStateAction();

export default function LineDisplay(props: any) {
  // Draw line circles/points
  const line: Line = props.line;

  let busLine: L.Polyline;

  createEffect(() => {
    // Take care of undo/redo
    busLine?.remove();

    if (isLineUnderConstruction(line)) {
      console.log("line under construction");
      console.dir(JSON.stringify(unwrap(line)));
    }

    const latlngs = [];
    for (const pointIdentity of line.stops) {
      if (isLineUnderConstruction(line)) {
        console.log("pointIdentity", pointIdentity);
        console.log("pointIdentity.id_point", pointIdentity.id_point);
      }
      const circle = linkMap.get(pointIdentity.id_point);
      if (isLineUnderConstruction(line)) {
        console.log("circle", circle);
      }
      if (circle) {
        latlngs.push(circle.getLatLng());
      }
    }

    if (isLineUnderConstruction(line)) {
      console.log("latlngs", latlngs);
    }

    let displayedColor = line.color;
    if (isLineUnderConstruction(line)) {
      displayedColor = COLOR_LINE_UNDER_CONSTRUCTION;
    }

    busLine = L.polyline(latlngs, {
      color: displayedColor,
    })
      .addTo(getLeafletMap())
      .on("mouseover", () => {
        createEffect(() => {
          if (!isInRemoveLineMode()) {
            busLine.setStyle({ color: displayedColor, weight: 3 });
          }
        });
        if (isInRemoveLineMode()) {
          busLine.setStyle({ color: "#FFF", weight: 8 });
        }
      })
      .on("mouseout", () => {
        if (isInRemoveLineMode()) {
          busLine.setStyle({ color: displayedColor, weight: 3 });
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
