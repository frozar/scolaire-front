import "leaflet/dist/leaflet.css";

import { Show, createSignal, onCleanup, onMount } from "solid-js";

import PointsRamassageAndEtablissement from "./PointsRamassageAndEtablissement";

import { useStateAction } from "../../../StateAction";
import { buildMapL7 } from "./l7MapBuilder";
import BusLines from "./line/BusLines";

import { useStateGui } from "../../../StateGui";
import ImportCsvCanvas from "../../../component/ImportCsvCanvas";
import ConfirmStopAddLine from "./ConfirmStopAddLineBox";
import { InformationBoard } from "./informationBoard/InformationBoard";
import LineUnderConstruction from "./line/LineUnderConstruction";
import RightMapMenu from "./component/organism/RightMapMenu";
import { listHandlerLMap } from "./shortcut";
import InformationBoardButton from "./component/organism/InformationBoardButton";
import AddLineButton from "./component/organism/AddLineButton";
import RemoveLineButton from "./component/organism/RemoveLineButton";
import ClearButton from "./component/organism/ClearButton";
import GenerateButton from "./component/organism/GenerateButton";
import ExportButton from "./component/organism/ExportButton";

const [, { isInAddLineMode }] = useStateAction();
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
        <LineUnderConstruction />
      </Show>
      <BusLines />
      <RightMapMenu>
        <InformationBoardButton />
        <AddLineButton />
        <RemoveLineButton />
        <ClearButton />
        <GenerateButton />
        <ExportButton />
      </RightMapMenu>
      <ConfirmStopAddLine />
    </Show>
  );
}
