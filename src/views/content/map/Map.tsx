import { Show, createSignal, onCleanup, onMount } from "solid-js";

import { useStateGui } from "../../../StateGui";

import { buildMapL7 } from "./l7MapBuilder";

import { BusCourses } from "./component/organism/Courses";

import ImportCsvCanvas from "../../../component/ImportCsvCanvas";
import ConfirmStopAddCourse from "./ConfirmStopAddCourseBox";

import { listHandlerLMap } from "./shortcut";

import "leaflet/dist/leaflet.css";
import { addNewUserInformation, getLeafletMap } from "../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../type";
import { BusLines } from "./component/organism/BusLines";
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
      <Points leafletMap={getLeafletMap() as L.Map} />
      <BusCourses map={getLeafletMap() as L.Map} />
      <BusLines map={getLeafletMap() as L.Map} />
      {/* <div class="z-[1000] absolute top-[45%] right-[15px]">
        <RightMapMenu />
      </div> */}
      {/* TODO Modify and re-activate export and generate functionalities */}
      <ConfirmStopAddCourse />
    </Show>
  );
}
