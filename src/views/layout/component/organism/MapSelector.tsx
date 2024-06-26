import { createEffect, createSignal, onMount } from "solid-js";

import { useStateGui } from "../../../../StateGui";
import { MapType } from "../../../../_entities/map.entity";
import { CalendarPeriodStore } from "../../../../_stores/calendar-period.store";
import { CalendarStore } from "../../../../_stores/calendar.store";
import { LineStore } from "../../../../_stores/line.store";
import { MapStore, userMaps } from "../../../../_stores/map.store";
import { SchoolStore } from "../../../../_stores/school.store";
import { StopStore } from "../../../../_stores/stop.store";
import { MapsUtils } from "../../../../utils/maps.utils";
import { setTrips } from "../../../content/map/component/organism/Trips";
import { setSelectedMenu } from "../../menuItemFields";
import "./MapSelector.css";

const [, { setActiveMapId }] = useStateGui();

export const [selectedMap, setSelectedMap] = createSignal<MapType | null>();
export function MapSelector() {
  onMount(async () => {
    await MapStore.fetchUserMaps();
    setSelectedMap(MapsUtils.getSelectedMap(userMaps()));
  });

  createEffect(() => {
    setSelectedMap(MapsUtils.getSelectedMap(userMaps()));

    //TODO placer le refresh ailleur (avant le reload des data dans init)
    if (!selectedMap() && selectedMap() != null) {
      setActiveMapId(null);
      SchoolStore.set([]);
      StopStore.set([]);
      CalendarStore.set([]);
      CalendarPeriodStore.set([]);
      setTrips([]);
      LineStore.set([]);
    }
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
