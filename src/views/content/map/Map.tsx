import { For, Show, createEffect, createSignal, onMount } from "solid-js";

import { useStateGui } from "../../../StateGui";

import { buildMapL7 } from "./l7MapBuilder";

import { Trips } from "./component/organism/Trips";

import { ImportCsvCanvas } from "../../../component/ImportCsvCanvas";
import ConfirmStopAddTrip from "./ConfirmStopAddTripBox";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { OsrmService, step } from "../../../_services/osrm.service";
import { addNewUserInformation, getLeafletMap } from "../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../type";
import { onBoard } from "../board/component/template/ContextManager";
import { LineWeight } from "./component/molecule/LineWeight";
import { BusLines, getLines } from "./component/organism/BusLines";
import { MapPanels } from "./component/organism/MapPanels";
import { Paths } from "./component/organism/Paths";
import { Points } from "./component/organism/Points";
import { getSchools } from "./component/organism/SchoolPoints";
import { getStops } from "./component/organism/StopPoints";

const [, { getActiveMapId, getSelectedMenu }] = useStateGui();

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

export const [ways, setWays] = createSignal<step[]>([]);
export default function () {
  const [displayImportCsvCanvas, setDisplayImportCsvCanvas] =
    createSignal(false);

  async function requestWays(): Promise<step[]> {
    const result = await OsrmService.getWaysWithWeight(240);
    const parsedResult = result.map((elem) => {
      return {
        flaxib_way_id: elem.id,
        name: elem.name,
        flaxib_weight: elem.weight,
        coordinates: JSON.parse(elem.line).coordinates.map((coord) =>
          L.latLng(coord[1], coord[0])
        ),
      };
    });
    // const parsedResult = JSON.parse(result);
    // console.log("OsrmService", result[0]["line"]);
    return parsedResult;
  }

  onMount(async () => {
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

  createEffect(async () => {
    if (getLeafletMap()) {
      const res = await requestWays();
      setWays(res);
    }
  });

  return (
    <Show when={getActiveMapId()}>
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

      <Show when={getSelectedMenu() != "voirie"}>
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
      <Show when={getSelectedMenu() === "voirie"}>
        <For each={ways()}>
          {(way) => {
            return <LineWeight way={way} map={getLeafletMap() as L.Map} />;
          }}
        </For>
      </Show>
      <div ref={mapDiv} id="main-map" />
    </Show>
  );
}
