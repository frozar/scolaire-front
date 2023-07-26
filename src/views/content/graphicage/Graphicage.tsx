import { Show, createSignal, onCleanup, onMount } from "solid-js";

import { useStateAction } from "../../../StateAction";
import { useStateGui } from "../../../StateGui";

import { buildMapL7 } from "./l7MapBuilder";

import PointsRamassageAndEtablissement from "./PointsRamassageAndEtablissement";
import BusLines from "./line/BusLines";

import ImportCsvCanvas from "../../../component/ImportCsvCanvas";
import ConfirmStopAddLine from "./ConfirmStopAddLineBox";

import { InformationBoard } from "./informationBoard/InformationBoard";

import RightMapMenu from "./component/organism/RightMapMenu";

import { listHandlerLMap } from "./shortcut";

import "leaflet/dist/leaflet.css";
import { getLeafletMap } from "../../../signaux";
import LineUnderConstruction from "./component/organism/LineUnderConstruction";

const [, { isInAddLineMode, getLineUnderConstruction }] = useStateAction();
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
      <PointsRamassageAndEtablissement />
      <Show when={isInAddLineMode()}>
        <LineUnderConstruction
          stops={getLineUnderConstruction().stops}
          leafletMap={getLeafletMap() as L.Map}
        />
      </Show>
      <BusLines />
      <div class="z-[1000] absolute top-[45%] right-[15px]">
        <RightMapMenu />
      </div>
      <ConfirmStopAddLine />
    </Show>
  );
}
