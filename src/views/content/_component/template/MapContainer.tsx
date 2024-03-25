import { Show, createSignal, onMount } from "solid-js";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useStateGui } from "../../../../StateGui";
import { ImportCsvCanvas } from "../../../../component/ImportCsvCanvas";
import { addNewUserInformation, getLeafletMap } from "../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../type";
import { onBoard } from "../../board/component/template/ContextManager";
import { MapPanels } from "../../map/component/organism/MapPanels";
import { buildMapL7 } from "../../map/l7MapBuilder";
import { SchoolPoints } from "../organisme/SchoolPoints";
import { StopPoints } from "../organisme/StopPoints";
import { Trips } from "../organisme/Trips";
import { Ways } from "../organisme/Ways";

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

export function MapContainer() {
  const [displayImportCsvCanvas, setDisplayImportCsvCanvas] =
    createSignal(false);

  onMount(async () => {
    // Manage shortcut keyboard event
    // for (const handler of listHandlerLMap) {
    // document.body.addEventListener("keydown", handler);
    // }

    //TODO utilité ?
    if (getActiveMapId()) {
      mapDiv.addEventListener(
        "dragenter",
        (e) => {
          e.preventDefault();
          setDisplayImportCsvCanvas(true);
        },
        false
      );
      buildMap(mapDiv);
    }
  });

  return (
    <Show when={getActiveMapId()}>
      {/* TODO utilité ? */}
      <ImportCsvCanvas
        display={displayImportCsvCanvas()}
        setDisplay={setDisplayImportCsvCanvas}
        callbackSuccess={() => {
          addNewUserInformation({
            displayed: true,
            level: MessageLevelEnum.success,
            type: MessageTypeEnum.global,
            content: "Les données ont été mises à jour",
          });
        }}
      />

      {/* TODO donner la possibilité de l'afficher par signal ? */}
      <Show when={onBoard() == "line"}>
        <MapPanels />
      </Show>

      {/* TODO utilité ? duplication ? */}
      <ImportCsvCanvas
        display={displayImportCsvCanvas()}
        setDisplay={setDisplayImportCsvCanvas}
        callbackSuccess={() => {
          addNewUserInformation({
            displayed: true,
            level: MessageLevelEnum.success,
            type: MessageTypeEnum.global,
            content: "Les données ont été mises à jour",
          });
        }}
      />

      <SchoolPoints map={getLeafletMap() as L.Map} />
      <StopPoints map={getLeafletMap() as L.Map} />
      <Trips map={getLeafletMap() as L.Map} />
      <Ways map={getLeafletMap() as L.Map} />

      {/* 
      <BusLines busLines={getLines()} />
      <Trips map={getLeafletMap() as L.Map} />
      <Paths map={getLeafletMap() as L.Map} /> */}

      {/* <ConfirmStopAddTrip /> */}

      <div ref={mapDiv} id="main-map" />
    </Show>
  );
}
