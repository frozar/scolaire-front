import "leaflet/dist/leaflet.css";

import { Show, createSignal, onCleanup, onMount } from "solid-js";

import PointsRamassageAndEtablissement from "./PointsRamassageAndEtablissement";

import { buildMapL7 } from "./l7MapBuilder";
import BusLines from "./line/BusLines";
import { useStateAction } from "../../../StateAction";

import LineUnderConstruction from "./line/LineUnderConstruction";
import ControlMapMenu from "./rightMapMenu/RightMapMenu";
import { InformationBoard } from "./informationBoard/InformationBoard";
import ConfirmStopAddLine from "./ConfirmStopAddLineBox";
import { listHandlerLMap } from "./shortcut";
import ImportCsvCanvas from "../../../component/ImportCsvCanvas";
import LayerChoiceMenu from "./layerChoice/LayerChoiceMenu";

const [, { isInAddLineMode }] = useStateAction();

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
    <>
      <ImportCsvCanvas
        display={displayImportCsvCanvas()}
        setDisplay={setDisplayImportCsvCanvas}
      />
      <InformationBoard />
      <div ref={mapDiv} id="main-map" />
      <PointsRamassageAndEtablissement />
      <Show when={isInAddLineMode()}>
        <LineUnderConstruction />
      </Show>
      <BusLines />
      <ControlMapMenu />
      <ConfirmStopAddLine />
      <LayerChoiceMenu />
    </>
  );
}
