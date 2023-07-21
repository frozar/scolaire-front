import L from "leaflet";
import { createEffect, onCleanup } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import {
  LineUnderConstructionType,
  PointIdentityType,
} from "../../../../../type";
import { linkMap } from "../../Point";
import { COLOR_LINE_UNDER_CONSTRUCTION } from "../../constant";
const [, { isInAddLineMode }] = useStateAction();

// Draw the tip of the line under construction between
// the last selected circle and the mouse position
export default function (props: {
  //latlngs: L.LatLng[];
  line: LineUnderConstructionType;
  leafletMap: L.Map;
  color: string;
  opacity: number;
}) {
  let lineUnderConstructionTip: L.Polyline | undefined = undefined;

  function onCleanupHandler() {
    const leafletMap = props.leafletMap;
    if (!leafletMap) {
      return;
    }

    if (leafletMap.hasEventListeners("mousemove")) {
      lineUnderConstructionTip?.remove();
      leafletMap.off("mousemove");
    }
  }

  // When the user leave the add line mode, clean up the line tip
  createEffect(() => {
    if (!isInAddLineMode()) {
      onCleanupHandler();
    }
    const leafletMap = props.leafletMap;
    const line = props.line;

    const stops = () => line.stops;
    leafletMap?.on("mousemove", ({ latlng }) => {
      // Draw line tip
      const lastPointIdentity = stops().at(-1);
      drawLineTip(lastPointIdentity, latlng, leafletMap);
    });
  });

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

    const circle = linkMap.get(lastPointIdentity.idPoint);
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

  onCleanup(() => {
    onCleanupHandler();
  });

  return <></>;
}
