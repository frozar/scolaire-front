import L from "leaflet";
import { Setter, Show, onMount } from "solid-js";
import { OrganizationMapBoundType } from "../../../../_entities/organization.entity";
import { OrganizationMapEdit } from "../molecule/OrganizationMapEdit";
import "./OrganizationMapWrapper.css";

interface OrganizationMapWrapperProps {
  mapBounds: OrganizationMapBoundType;
  mapBoundssetter?: Setter<OrganizationMapBoundType>;
  editing?: boolean;
}

export function OrganizationMapWrapper(props: OrganizationMapWrapperProps) {
  onMount(() => {
    buildMap();
  });

  function buildMap() {
    const tmpleafletMap = new L.Map("sub-map", {
      zoomControl: false,
      zoomSnap: 0.1,
      zoomDelta: 0.1,
      wheelPxPerZoomLevel: 200,
      tap: false,
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(tmpleafletMap);

    const corner1 = L.latLng(
      props.mapBounds.corner1.lat as number,
      props.mapBounds.corner1.lng as number
    );
    const corner2 = L.latLng(
      props.mapBounds.corner2.lat as number,
      props.mapBounds.corner2.lng as number
    );
    const bounds = L.latLngBounds(corner1, corner2);
    tmpleafletMap.fitBounds(bounds);

    if (!props.editing) {
      tmpleafletMap.dragging.disable();
      tmpleafletMap.doubleClickZoom.disable();
      tmpleafletMap.scrollWheelZoom.disable();
      tmpleafletMap.keyboard.disable();
    }

    // eslint-disable-next-line solid/reactivity
    tmpleafletMap.on("move", () => {
      const corner1 = tmpleafletMap.getBounds().getNorthEast();
      const corner2 = tmpleafletMap.getBounds().getSouthWest();
      const newBounds = { corner1, corner2 };
      if (props.mapBoundssetter) props.mapBoundssetter(newBounds);
    });
  }

  return (
    <div class="flex gap-6">
      <div>
        <Show
          when={!props.editing}
          fallback={
            <OrganizationMapEdit
              mapBounds={props.mapBounds}
              setter={props.mapBoundssetter as Setter<OrganizationMapBoundType>}
            />
          }
        >
          <p class="font-bold">Map Bounds</p>
          <p class="pl-4">
            Lattitude coin Nord-Est : {props.mapBounds.corner1.lat}
          </p>
          <p class="pl-4">
            Longitude coin Nord-Est : {props.mapBounds.corner1.lng}
          </p>
          <br />
          <p class="pl-4">
            Lattitude coin Sud-Ouest : {props.mapBounds.corner2.lat}
          </p>
          <p class="pl-4">
            Longitude coin Sud-Ouest : {props.mapBounds.corner2.lng}
          </p>
        </Show>
      </div>
      <div id="sub-map" />
    </div>
  );
}
