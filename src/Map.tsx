import "leaflet/dist/leaflet.css";

import { onMount } from "solid-js";

import PointsRamassageAndEtablissement from "./PointsRamassageAndEtablissement";

import { buildMapL7 } from "./l7MapBuilder";
import { buildMapLeafletPostCode } from "./leafletMapPostCodeBuilder";
import { buildMapLeafletRouteRaw } from "./leafletMapRouteRawBuilder";
import LineUnderConstruction from "./LineUnderConstruction";

function buildMap(div: HTMLDivElement) {
  const option: string = "l7";
  switch (option) {
    case "leafletRouteRaw": {
      buildMapLeafletRouteRaw(div);
      break;
    }
    case "leafletPostCode": {
      buildMapLeafletPostCode(div);
      break;
    }
    case "l7": {
      buildMapL7(div);
      break;
    }
  }
}

function Map() {
  let mapDiv: any;
  onMount(() => buildMap(mapDiv));
  return (
    <>
      <div ref={mapDiv} id="main-map" />
      <PointsRamassageAndEtablissement />
      <LineUnderConstruction />
    </>
  );
}

export default Map;
