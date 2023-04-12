import { onCleanup, createEffect } from "solid-js";
import L from "leaflet";
import { useStateAction } from "../StateAction";
import { getLeafletMap } from "../global/leafletMap";
import { linkMap } from "../global/linkPointIdentityCircle";

const [stateAction, { isInAddLineMode }] = useStateAction();

// Draw the tip of the line under construction between
// the last selected circle and the mouse position
export default function LineUnderConstructionTip() {
  let lineUnderConstructionTip: L.Polyline | undefined = undefined;

  function onCleanupHandler() {
    const leafletMap = getLeafletMap();
    if (leafletMap.hasEventListeners("mousemove")) {
      lineUnderConstructionTip?.remove();
      if (!leafletMap) {
        return;
      }
      leafletMap.off("mousemove");
    }
  }

  // When the user leave the add line mode, clean up the line tip
  createEffect(() => {
    if (!isInAddLineMode()) {
      onCleanupHandler();
    }
  });

  createEffect(() => {
    const leafletMap = getLeafletMap();
    if (!leafletMap) {
      return;
    }
    if (isInAddLineMode()) {
      leafletMap.on("mousemove", ({ latlng: mouseLatLon }) => {
        lineUnderConstructionTip?.remove();

        const lastPointIdentity =
          stateAction.lineUnderConstruction.stops.at(-1);

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
    }
  });

  onCleanup(() => {
    onCleanupHandler();
  });

  return <></>;
}
