import L from "leaflet";
import { Show, onMount } from "solid-js";
import { OrganizationType } from "../../../../_entities/organization.entity";
import "./OrganizationMapWrapper.css";

interface OrganizationMapWrapperProps {
  org: OrganizationType;
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
      props.org.mapBounds.corner1.lat as number,
      props.org.mapBounds.corner1.lng as number
    );
    const corner2 = L.latLng(
      props.org.mapBounds.corner2.lat as number,
      props.org.mapBounds.corner2.lng as number
    );
    const bounds = L.latLngBounds(corner1, corner2);
    tmpleafletMap.fitBounds(bounds);

    if (!props.editing) {
      tmpleafletMap.dragging.disable();
      tmpleafletMap.doubleClickZoom.disable();
      tmpleafletMap.scrollWheelZoom.disable();
      tmpleafletMap.keyboard.disable();
    }

    tmpleafletMap.on("move", function () {
      // TODO onMapMove function
      console.log(tmpleafletMap.getBounds());
      console.log(tmpleafletMap.getZoom());
    });
  }

  return (
    <div class="flex gap-6">
      <div>
        <Show when={!props.editing}>
          <p class="font-bold">Map Bounds</p>
          <p class="pl-4">
            Lattitude coin Nord-Est : {props.org.mapBounds.corner1.lat}
          </p>
          <p class="pl-4">
            Longitude coin Nord-Est : {props.org.mapBounds.corner1.lng}
          </p>
          <br />
          <p class="pl-4">
            Lattitude coin Sud-Ouest : {props.org.mapBounds.corner2.lat}
          </p>
          <p class="pl-4">
            Longitude coin Sud-Ouest : {props.org.mapBounds.corner2.lng}
          </p>
        </Show>
      </div>
      <div id="sub-map" />
    </div>
  );
}
