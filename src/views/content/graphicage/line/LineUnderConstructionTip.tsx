import { onCleanup, createEffect } from "solid-js";
import L from "leaflet";
import { useStateAction } from "../../../../StateAction";
import { getLeafletMap } from "../../../../signaux";
import { linkMap } from "../../../../global/linkPointIdentityCircle";
import { COLOR_LINE_UNDER_CONSTRUCTION } from "../constant";
import { PointIdentityType } from "../../../../type";

const [, { isInAddLineMode, getLineUnderConstruction }] = useStateAction();

// Draw the tip of the line under construction between
// the last selected circle and the mouse position
export default function () {
  let lineUnderConstructionTip: L.Polyline | undefined = undefined;

  function onCleanupHandler() {
    const leafletMap = getLeafletMap();
    if (!leafletMap) {
      return;
    }
    for (const event of ["mousemove", "mousedown"]) {
      if (leafletMap.hasEventListeners(event)) {
        leafletMap.off(event);
      }
    }
    lineUnderConstructionTip?.remove();
  }

  // When the user leave the add line mode, clean up the line tip
  createEffect(() => {
    if (!isInAddLineMode()) {
      onCleanupHandler();
    }
  });

  const stops = () => getLineUnderConstruction().stops;

  function drawLineTip(
    lastPointIdentity: PointIdentityType | undefined,
    latlng: L.LatLng,
    leafletMap: L.Map | null
  ) {
    if (!leafletMap || !isInAddLineMode()) {
      return;
    }
    if (!lastPointIdentity) {
      return;
    }

    const circle = linkMap.get(lastPointIdentity.id_point);
    if (!circle) {
      return;
    }

    const latlngs = [circle.getLatLng(), latlng];

    // If the tip doesn't exist, create it and add it to the map,...
    if (!lineUnderConstructionTip) {
      lineUnderConstructionTip = L.polyline(latlngs, {
        color: COLOR_LINE_UNDER_CONSTRUCTION,
        pane: "markerPane",
      });
      lineUnderConstructionTip.addTo(leafletMap);
    }
    // ... else update it
    else {
      lineUnderConstructionTip.setLatLngs(latlngs);
    }

    // The line tip must not catch mouse event like click, hover, etc...
    const element = lineUnderConstructionTip?.getElement() as SVGElement;
    if (element && String(element.style) !== "pointer-events: none;") {
      // @ts-expect-error: 'style' field should not be assigned
      element.style = "pointer-events: none;";
    }
  }

  const leafletMap = getLeafletMap();

  leafletMap?.on("mousemove", ({ latlng }) => {
    // Draw line tip
    const lastPointIdentity = stops().at(-1);
    drawLineTip(lastPointIdentity, latlng, leafletMap);
  });

  onCleanup(() => {
    onCleanupHandler();
  });

  return <></>;
}
