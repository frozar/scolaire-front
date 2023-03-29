import { onCleanup, createEffect } from "solid-js";
import L from "leaflet";

import { useStateAction } from "./StateAction";
import { linkMap } from "./global/linkPointIdentityCircle";
import { getLeafletMap } from "./global/leafletMap";
import { lineUnderConstructionState } from "./signaux";

const [stateAction] = useStateAction();

export default function LineUnderConstruction() {
  // Draw line under construction between circles/points
  let lineUnderConstruction: L.Polyline;
  createEffect(() => {
    // Take care of undo/redo
    lineUnderConstruction?.remove();

    const latlngs = [];
    for (const pointIdentity of stateAction.lineUnderConstruction.stops) {
      const circle = linkMap.get(pointIdentity);
      if (circle) {
        latlngs.push(circle.getLatLng());
      }
    }

    lineUnderConstruction = L.polyline(latlngs, { color: "blue" }).addTo(
      getLeafletMap()
    );
  });

  // Draw the tip of the line under construction between
  // the last selected circle and the mouse position
  let lineUnderConstructionTip: L.Polyline | undefined;
  createEffect(() => {
    const leafletMap = getLeafletMap();
    if (!leafletMap) {
      return;
    }
    leafletMap.on("mousemove", ({ latlng: mouseLatLon }) => {
      lineUnderConstructionTip?.remove();

      const lastPointIdentity = stateAction.lineUnderConstruction.stops.at(-1);

      if (!lineUnderConstructionState().active || !lastPointIdentity) {
        lineUnderConstructionTip = undefined;
        return;
      }

      const circle = linkMap.get(lastPointIdentity);

      if (!circle) {
        lineUnderConstructionTip = undefined;
        return;
      }

      const latlngs = [circle.getLatLng(), mouseLatLon];

      if (lineUnderConstructionTip === undefined) {
        lineUnderConstructionTip = L.polyline(latlngs, {
          color: "blue",
        });
      } else {
        lineUnderConstructionTip.setLatLngs(latlngs);
      }

      lineUnderConstructionTip.addTo(leafletMap);

      const element = lineUnderConstructionTip?.getElement() as SVGElement;
      if (element && String(element.style) !== "pointer-events: none;") {
        // @ts-expect-error
        element.style = "pointer-events: none;";
      }
    });
  });

  onCleanup(() => {
    lineUnderConstruction.remove();
    const leafletMap = getLeafletMap();
    if (!leafletMap) {
      return;
    }
    leafletMap.off("mousemove");
  });

  return <></>;
}
