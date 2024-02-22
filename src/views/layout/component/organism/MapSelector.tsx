import { createEffect, createSignal, onMount } from "solid-js";

import { MapType } from "../../../../_entities/map.entity";
import { MapStore, userMaps } from "../../../../_stores/map.store";
import { MapsUtils } from "../../../../utils/maps.utils";
import { setSelectedMenu } from "../../menuItemFields";
import "./MapSelector.css";

const [selectedMap, setSelectedMap] = createSignal<MapType | null>();

export function MapSelector() {
  onMount(async () => {
    await MapStore.fetchUserMaps();
    setSelectedMap(MapsUtils.getSelectedMap(userMaps()));
  });

  createEffect(() => {
    setSelectedMap(MapsUtils.getSelectedMap(userMaps()));
  });

  return (
    <div id="map-selector">
      <label class="map-selector-label">Carte</label>
      <button
        class="map-selector-btn selector"
        onClick={() => {
          onclick();
        }}
      >
        {selectedMap() ? selectedMap()?.name : "Sélectionner une carte"}
      </button>
    </div>
  );
}

function onclick() {
  setSelectedMenu("maps");
}
