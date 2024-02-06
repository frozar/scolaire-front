import { Show, createSignal, onMount } from "solid-js";

import { useStateGui } from "../../../StateGui";

import { buildMapL7 } from "./l7MapBuilder";

import { Trips } from "./component/organism/Trips";

import { ImportCsvCanvas } from "../../../component/ImportCsvCanvas";
import ConfirmStopAddTrip from "./ConfirmStopAddTripBox";

import "leaflet/dist/leaflet.css";
import { addNewUserInformation, getLeafletMap } from "../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../type";
import { onBoard } from "../board/component/template/ContextManager";
import { BusLines, getLines } from "./component/organism/BusLines";
import { MapPanels } from "./component/organism/MapPanels";
import { Paths } from "./component/organism/Paths";
import { Points } from "./component/organism/Points";
import { getSchools } from "./component/organism/SchoolPoints";
import { getStops } from "./component/organism/StopPoints";

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
    // for (const handler of listHandlerLMap) {
    // document.body.addEventListener("keydown", handler);
    // }
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
      <Show when={onBoard() == "line"}>
        <MapPanels />
      </Show>
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
      <div ref={mapDiv} id="main-map" />
      <Points
        leafletMap={getLeafletMap() as L.Map}
        stops={getStops()}
        schools={getSchools()}
      />
      <BusLines busLines={getLines()} />
      <Trips map={getLeafletMap() as L.Map} />
      <Paths map={getLeafletMap() as L.Map} />
      <ConfirmStopAddTrip />
    </Show>
  );
}
