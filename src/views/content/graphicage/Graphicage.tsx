import { Show, createSignal, onCleanup, onMount } from "solid-js";

import { useStateGui } from "../../../StateGui";

import { buildMapL7 } from "./l7MapBuilder";

import { BusLines } from "./component/organism/BusLines";

import ImportCsvCanvas from "../../../component/ImportCsvCanvas";
import ConfirmStopAddLine from "./ConfirmStopAddLineBox";

import { InformationBoard } from "./informationBoard/InformationBoard";

import RightMapMenu from "./component/organism/RightMapMenu";

import { listHandlerLMap } from "./shortcut";

import "leaflet/dist/leaflet.css";
import { getLeafletMap } from "../../../signaux";
import { Points } from "./component/organism/Points";

const [, { getActiveMapId }] = useStateGui();
function buildMap(div: HTMLDivElement) {
  const option = "l7";
  switch (option) {
    case "l7": {
      buildMapL7(div);
      break;
    }
  }
}

let mapDiv: HTMLDivElement;

export default function () {
  const [displayImportCsvCanvas, setDisplayImportCsvCanvas] =
    createSignal(false);

  onMount(() => {
    // Manage shortcut keyboard event
    for (const handler of listHandlerLMap) {
      document.body.addEventListener("keydown", handler);
    }

    mapDiv.addEventListener(
      "dragenter",
      (e) => {
        e.preventDefault();
        setDisplayImportCsvCanvas(true);
      },
      false
    );

    buildMap(mapDiv);
  });

  onCleanup(() => {
    // Manage shortcut keyboard event
    for (const handler of listHandlerLMap) {
      document.body.removeEventListener("keydown", handler);
    }
  });

  return (
    <Show when={getActiveMapId()} fallback={<div>Sélectionner une carte</div>}>
      <ImportCsvCanvas
        display={displayImportCsvCanvas()}
        setDisplay={setDisplayImportCsvCanvas}
      />
      <InformationBoard />
      <div ref={mapDiv} id="main-map" />
      <Points leafletMap={getLeafletMap() as L.Map} />
      <BusLines map={getLeafletMap() as L.Map} />
      <div class="z-[1000] absolute top-[45%] right-[15px]">
        <RightMapMenu />
      </div>
      <ConfirmStopAddLine />
    </Show>
  );
}
