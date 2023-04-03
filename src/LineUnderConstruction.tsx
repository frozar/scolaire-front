import { onCleanup, createEffect } from "solid-js";
import L from "leaflet";

import { useStateAction } from "./StateAction";
import { linkMap } from "./global/linkPointIdentityCircle";
import { getLeafletMap } from "./global/leafletMap";
import { lineUnderConstructionState } from "./signaux";
import LineDisplay from "./LineDisplay";

const [stateAction] = useStateAction();

export default function LineUnderConstruction() {
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
    lineUnderConstructionTip!.remove();
    const leafletMap = getLeafletMap();
    if (!leafletMap) {
      return;
    }
    leafletMap.off("mousemove");
  });

  return <LineDisplay line={stateAction.lineUnderConstruction} />;
}
