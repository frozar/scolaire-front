import { onCleanup, createEffect } from "solid-js";
import L from "leaflet";

import { useStateAction } from "./StateAction";
import { linkMap } from "./global/linkPointIdentityCircle";
import { getLeafletMap } from "./global/leafletMap";

const [stateAction, { isInAddLineMode }] = useStateAction();

//TODO: rename to lineUnderConstructionTip
// Draw the tip of the line under construction between
// the last selected circle and the mouse position
export default function LineUnderConstruction() {
  let lineUnderConstructionTip: L.Polyline | undefined;

  function onCleanupHandler() {
    lineUnderConstructionTip?.remove();
    const leafletMap = getLeafletMap();
    if (!leafletMap) {
      return;
    }
    leafletMap.off("mousemove");
  }

  // When the user leave the add line mode, clean up the line tip
  createEffect(() => {
    if (lineUnderConstructionTip && !isInAddLineMode()) {
      onCleanupHandler();
    }
  });

  createEffect(() => {
    const leafletMap = getLeafletMap();
    if (!leafletMap) {
      return;
    }
    leafletMap.on("mousemove", ({ latlng: mouseLatLon }) => {
      lineUnderConstructionTip?.remove();

      const lastPointIdentity = stateAction.lineUnderConstruction.stops.at(-1);

      if (!isInAddLineMode() || !lastPointIdentity) {
        lineUnderConstructionTip = undefined;
        return;
      }

      const circle = linkMap.get(lastPointIdentity.id_point);

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
    onCleanupHandler();
  });

  return <></>;
}
