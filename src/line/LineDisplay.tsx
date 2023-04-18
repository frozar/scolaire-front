import { onCleanup, createEffect } from "solid-js";
import L from "leaflet";
import { useStateAction } from "../StateAction";
import { COLOR_LINE_UNDER_CONSTRUCTION } from "../constant";
import { getLeafletMap } from "../global/leafletMap";
import { linkMap } from "../global/linkPointIdentityCircle";
import { setRemoveConfirmation } from "../signaux";
import { Line } from "../type";

const [, { isInRemoveLineMode, isLineUnderConstruction }] = useStateAction();

export default function LineDisplay(props: any) {
  // Draw line circles/points
  const line: Line = props.line;

  let busLine: L.Polyline;

  createEffect(() => {
    // Take care of undo/redo
    busLine?.remove();

    const latlngs = [];
    for (const pointIdentity of line.stops) {
      const circle = linkMap.get(pointIdentity.id_point);
      console.log("pointIdentity", pointIdentity);
      console.log("circle", circle);
      if (circle) {
        latlngs.push(circle.getLatLng());
      }
    }
    console.log(line);
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
    console.log("ligne crée");
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
