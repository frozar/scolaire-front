import { For, Show, createEffect, createSignal, onMount } from "solid-js";

import { useStateGui } from "../../../StateGui";

import { buildMapL7 } from "./l7MapBuilder";

import { Trips } from "./component/organism/Trips";

import { ImportCsvCanvas } from "../../../component/ImportCsvCanvas";
import ConfirmStopAddTrip from "./ConfirmStopAddTripBox";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { OsrmService, step } from "../../../_services/osrm.service";
import { getLines } from "../../../_stores/line.store";
import { getSchools } from "../../../_stores/school.store";
import { getStops } from "../../../_stores/stop.store";
import {
  addNewUserInformation,
  disableSpinningWheel,
  enableSpinningWheel,
  getLeafletMap,
} from "../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../type";
import { onBoard } from "../board/component/template/ContextManager";
import { LineWeight, getSelectedWays } from "./component/molecule/LineWeight";
import { BusLines } from "./component/organism/BusLines";
import { MapPanels } from "./component/organism/MapPanels";
import { Points } from "./component/organism/Points";
import { COLOR_BLUE_BASE, COLOR_GREEN_BASE } from "./constant";

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

const [waysIsFetch, setWaysIsFetch] = createSignal<boolean>();

export function getWayById(way_id: number): step {
  return ways().filter((way) => way.flaxib_way_id == way_id)[0];
}

export function getWaysById(way_ids: number[]): step[] {
  return ways().filter((way) => way_ids.includes(way.flaxib_way_id));
}

export default function () {
  const [displayImportCsvCanvas, setDisplayImportCsvCanvas] =
    createSignal(false);

  async function requestWays(): Promise<step[]> {
    const DBResult = await OsrmService.getWaysWithWeight();
    if (DBResult) {
      const parsedResult = DBResult.map((elem) => {
        return {
          flaxib_way_id: elem.id,
          name: elem.name,
          flaxib_weight: elem.weight,
          coordinates: JSON.parse(elem.line).coordinates.map(
            (coord: number[]) => L.latLng(coord[1], coord[0])
          ),
        };
      });
      // const parsedResult = JSON.parse(result);
      // console.log("OsrmService", result[0]["line"]);
      return parsedResult;
    }
    return [];
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

  // eslint-disable-next-line solid/reactivity
  createEffect(async () => {
    if (getLeafletMap() && ways().length === 0 && waysIsFetch() == undefined) {
      setWaysIsFetch(false);
      const res = await requestWays();
      setWays(res);
      setWaysIsFetch(true);
    }
  });

  // eslint-disable-next-line solid/reactivity
  createEffect(async () => {
    if (!waysIsFetch() && getSelectedMenu() === "roadways") {
      enableSpinningWheel();
    } else {
      disableSpinningWheel();
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

      <Show when={getSelectedMenu() != "roadways"}>
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
        {/* <Paths map={getLeafletMap() as L.Map} /> */}

        <ConfirmStopAddTrip />
      </Show>
      <Show when={getSelectedMenu() === "roadways"}>
        <For each={ways()}>
          {(way) => {
            return (
              <LineWeight
                way={way}
                map={getLeafletMap() as L.Map}
                lineColor={
                  getSelectedWays()
                    .map((way) => way.flaxib_way_id)
                    .includes(way.flaxib_way_id)
                    ? COLOR_BLUE_BASE
                    : COLOR_GREEN_BASE
                }
              />
            );
          }}
        </For>
      </Show>
      <div ref={mapDiv} id="main-map" />
    </Show>
  );
}
