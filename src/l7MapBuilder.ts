import { createEffect } from "solid-js";

import L from "leaflet";
import { L7Layer } from "@antv/l7-leaflet";
import { getLeafletMap, setLeafletMap } from "./global/leafletMap";
import { enableSpinningWheel, disableSpinningWheel } from "./signaux";

import { useStateAction } from "./StateAction";
import FlaxibMapLogo from "./FlaxibMapLogo";

const [, { isInAddLineMode }] = useStateAction();

function addLogoFlaxib(map: L.Map) {
  const logoControl = L.Control.extend({
    //control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
    options: {
      position: "bottomleft",
    },

    onAdd: FlaxibMapLogo,
  });
  new logoControl().addTo(map);
}

export function buildMapL7(div: HTMLDivElement) {
  enableSpinningWheel();

  setLeafletMap(
    L.map(div, {
      zoomControl: false,
      zoomSnap: 0.1,
      zoomDelta: 0.1,
      wheelPxPerZoomLevel: 200,
    }).setView([-20.930746, 55.527503], 13)
  );

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(getLeafletMap());

  // addLegend(getLeafletMap());
  addLogoFlaxib(getLeafletMap());
  // If a line is under construction, disable the possibility
  // to pan the map
  createEffect(() => {
    const dragging = getLeafletMap().dragging;
    if (dragging) {
      if (isInAddLineMode()) {
        dragging.disable();
      } else {
        dragging.enable();
      }
    }
  });

  // The argument in the constructor of the 'L7Layer' is simply pass to
  // Leaflet Layer as options for the constructor
  const l7layer = new L7Layer({});
  l7layer.addTo(getLeafletMap());

  const scene = l7layer.getScene();

  // Remove the L7 logo
  scene.removeControl(scene.getControlByName("logo"));

  // To retrieve control over the cursor, remove the 'l7-interactive' class
  scene.getMapCanvasContainer().classList.remove("l7-interactive");
  disableSpinningWheel();
}
