import { Show, createEffect, createSignal, onMount } from "solid-js";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useStateGui } from "../../../../StateGui";
import {
  OrganizationEntity,
  OrganizationType,
} from "../../../../_entities/organization.entity";
import { OrganisationService } from "../../../../_services/organisation.service";
import { OrganizationStore } from "../../../../_stores/organization.store";
import { ImportCsvCanvas } from "../../../../component/ImportCsvCanvas";
import {
  addNewUserInformation,
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum, TileId } from "../../../../type";
import { getSelectedOrganisation } from "../../board/component/organism/OrganisationSelector";
import { onBoard } from "../../board/component/template/ContextManager";
import { MapOptionsPanel } from "../../map/component/organism/MapOptionsPanel";
import { MapPanels } from "../../map/component/organism/MapPanels";
import { getTileById } from "../../map/tileUtils";
import { BusStopPoints } from "../organisme/BusStopPoints";
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

export function resetMapPosition() {
  const goodOrganization = OrganizationStore.get().find(
    (org) => org.id == getSelectedOrganisation().organisation_id
  ) as OrganizationType;

  const corner1 = L.latLng(
    goodOrganization.mapBounds.corner1.lat,
    goodOrganization.mapBounds.corner1.lng
  );

  const corner2 = L.latLng(
    goodOrganization.mapBounds.corner2.lat,
    goodOrganization.mapBounds.corner2.lng
  );

  const bounds = L.latLngBounds(corner1, corner2);
  leafletMap()?.fitBounds(bounds);
}

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
    let callBack: (e: L.LeafletMouseEvent) => void = (e) => {
      e;
    };
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
    });
    setMapBounds(leafletMap);
    setLeafletMap(leafletMap);
  }

  async function setMapBounds(map: L.Map) {
    if (OrganizationStore.get().length <= 0) {
      enableSpinningWheel();
      const organizations = await OrganisationService.getAll();
      disableSpinningWheel();
      OrganizationStore.set(organizations);
    }

    const goodOrganization = OrganizationStore.get().find(
      (org) => org.id == getSelectedOrganisation().organisation_id
    ) as OrganizationType;

    if (
      goodOrganization.mapBounds.corner1.lat == 0 &&
      goodOrganization.mapBounds.corner2.lat == 0 &&
      goodOrganization.mapBounds.corner1.lng == 0 &&
      goodOrganization.mapBounds.corner2.lng == 0
    )
      goodOrganization.mapBounds =
        OrganizationEntity.defaultOrganizationMapBounds();

    const corner1 = L.latLng(
      goodOrganization.mapBounds.corner1.lat,
      goodOrganization.mapBounds.corner1.lng
    );

    const corner2 = L.latLng(
      goodOrganization.mapBounds.corner2.lat,
      goodOrganization.mapBounds.corner2.lng
    );

    const bounds = L.latLngBounds(corner1, corner2);
    map.fitBounds(bounds);
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

      <MapOptionsPanel />
      <SchoolPoints map={leafletMap() as L.Map} />
      <StopPoints map={leafletMap() as L.Map} />
      <BusStopPoints map={leafletMap() as L.Map} />
      <Trips map={leafletMap() as L.Map} />
      <Ways map={leafletMap() as L.Map} />

      {/* <ConfirmStopAddTrip /> */}

      <div ref={mapDiv} id="main-map" />
    </Show>
  );
}
