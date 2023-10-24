import { Show, createEffect, createSignal, onMount } from "solid-js";

import { useStateGui } from "../../../StateGui";

import { buildMapL7 } from "./l7MapBuilder";

import { Trips } from "./component/organism/Trips";

import ImportCsvCanvas from "../../../component/ImportCsvCanvas";
import ConfirmStopAddTrip from "./ConfirmStopAddTripBox";

import "leaflet/dist/leaflet.css";
import { InitService, InitType } from "../../../_services/init.service";
import {
  addNewUserInformation,
  getAuthenticatedUser,
  getLeafletMap,
} from "../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../type";
import { BusLines } from "./component/organism/BusLines";
import { Points } from "./component/organism/Points";

const [, { getActiveMapId, setActiveMapId }] = useStateGui();
// ! ActiveMapId to set !
// setActiveMapId(null);
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
const [init, setinit] = createSignal<InitType>();

export default function () {
  const [displayImportCsvCanvas, setDisplayImportCsvCanvas] =
    createSignal(false);
  // eslint-disable-next-line solid/reactivity
  createEffect(async () => {
    if (getAuthenticatedUser()) setinit(await InitService.getAll());
  });
  onMount(() => {
    // Manage shortcut keyboard event
    // for (const handler of listHandlerLMap) {
    // document.body.addEventListener("keydown", handler);
    // }

    mapDiv.addEventListener(
      "dragenter",
      (e) => {
        // console.log("=>", 0);
        e.preventDefault();
        setDisplayImportCsvCanvas(true);
      },
      false
    );
    // console.log("=>", 1);
    buildMap(mapDiv);
  });

  // onCleanup(() => {
  //   // Manage shortcut keyboard event
  //   for (const handler of listHandlerLMap) {
  //     // document.body.removeEventListener("keydown", handler);
  //   }
  // });
  console.log("getActiveMapId()", getActiveMapId());
  return (
    <Show
      when={getActiveMapId() != null}
      fallback={<div>Sélectionner une carte</div>}
    >
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
        stops={init()?.stops ?? []}
        schools={init()?.schools ?? []}
      />
      <BusLines busLines={init()?.busLines ?? []} />
      <Trips map={getLeafletMap() as L.Map} />
      {/* <div class="z-[1000] absolute top-[45%] right-[15px]">
        <RightMapMenu />
      </div> */}
      {/* TODO Modify and re-activate export and generate functionalities */}
      <ConfirmStopAddTrip />
    </Show>
  );
}
