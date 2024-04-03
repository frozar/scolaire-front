import { Show, createEffect, createSignal, onMount } from "solid-js";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useStateGui } from "../../../../StateGui";
import { ImportCsvCanvas } from "../../../../component/ImportCsvCanvas";
import { addNewUserInformation } from "../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum, TileId } from "../../../../type";
import { onBoard } from "../../board/component/template/ContextManager";
import { MapPanels } from "../../map/component/organism/MapPanels";
import { getTileById } from "../../map/tileUtils";
import { SchoolPoints } from "../organisme/SchoolPoints";
import { StopPoints } from "../organisme/StopPoints";
import { Trips } from "../organisme/Trips";
import { Ways } from "../organisme/Ways";

const [, { getActiveMapId }] = useStateGui();

const defaultTileId = "OpenStreetMap_Mapnik";

export const [leafletMap, setLeafletMap] = createSignal<L.Map>();

export const [tileLayerId, setTileLayerId] = createSignal<TileId | undefined>();

export const [mapOnClick, setMapOnClick] =
  createSignal<(e: L.LeafletMouseEvent) => void | undefined>();

let mapDiv: HTMLDivElement;

export function MapContainer() {
  const [displayImportCsvCanvas, setDisplayImportCsvCanvas] =
    createSignal(false);

  onMount(() => {
    init();
  });

  /**
   * Change tile layer
   */
  createEffect(() => {
    let layerID: TileId;
    if (tileLayerId()) {
      layerID = tileLayerId() as TileId;
    } else {
      layerID = defaultTileId;
    }
    const tileLayer: L.TileLayer = getTileById(layerID).tileContent;

    (leafletMap() as L.Map).eachLayer(function (layer) {
      if (layer instanceof L.TileLayer) {
        layer.remove();
      }
    });
    tileLayer.remove();
    tileLayer.addTo(leafletMap() as L.Map);
  });

  /**
   * Change map click
   */
  createEffect(() => {
    let callBack: (e: L.LeafletMouseEvent) => void = (e) => {};
    if (typeof mapOnClick() == "function") {
      callBack = mapOnClick() as (e: L.LeafletMouseEvent) => void;
    }
    (leafletMap() as L.Map)
      .removeEventListener("click")
      .addEventListener("click", callBack);
  });

  function init() {
    if (getActiveMapId()) {
      mapDiv.addEventListener(
        "dragenter",
        (e) => {
          e.preventDefault();
          setDisplayImportCsvCanvas(true);
        },
        false
      );
      buildMap();
    }
  }
  function buildMap() {
    const leafletMap = new L.Map(mapDiv, {
      zoomControl: false,
      zoomSnap: 0.1,
      zoomDelta: 0.1,
      wheelPxPerZoomLevel: 200,
      tap: false,
    }).setView([-20.930746, 55.527503], 13);

    setLeafletMap(leafletMap);
  }

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

      <SchoolPoints map={leafletMap() as L.Map} />
      <StopPoints map={leafletMap() as L.Map} />
      <Trips map={leafletMap() as L.Map} />
      <Ways map={leafletMap() as L.Map} />

      {/* <ConfirmStopAddTrip /> */}

      <div ref={mapDiv} id="main-map" />
    </Show>
  );
}
