import L from "leaflet";
import { Setter, Show, onMount } from "solid-js";
import { OrganizationMapBoundType } from "../../../../_entities/organization.entity";
import { OrganizationMapEdit } from "../molecule/OrganizationMapEdit";
import { OrganizationMapInfo } from "../molecule/OrganizationMapInfo";
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
    const leafletMap = new L.Map("sub-map", {
      zoomControl: false,
      zoomSnap: 0.1,
      zoomDelta: 0.1,
      wheelPxPerZoomLevel: 200,
      tap: false,
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(leafletMap);

    const corner1 = L.latLng(
      props.mapBounds.corner1.lat as number,
      props.mapBounds.corner1.lng as number
    );
    const corner2 = L.latLng(
      props.mapBounds.corner2.lat as number,
      props.mapBounds.corner2.lng as number
    );
    const bounds = L.latLngBounds(corner1, corner2);
    leafletMap.fitBounds(bounds);

    if (!props.editing) {
      leafletMap.dragging.disable();
      leafletMap.doubleClickZoom.disable();
      leafletMap.scrollWheelZoom.disable();
      leafletMap.keyboard.disable();
    }

    // eslint-disable-next-line solid/reactivity
    leafletMap.on("move", () => {
      const corner1 = leafletMap.getBounds().getNorthEast();
      const corner2 = leafletMap.getBounds().getSouthWest();
      const newBounds = { corner1, corner2 };
      if (props.mapBoundssetter) props.mapBoundssetter(newBounds);
    });
  }

  return (
    <div class="organization-map-wrapper">
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
          <OrganizationMapInfo mapBounds={props.mapBounds} />
        </Show>
      </div>
      <div id="sub-map" />
    </div>
  );
}
