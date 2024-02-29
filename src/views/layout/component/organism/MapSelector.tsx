import { createEffect, createSignal, onMount } from "solid-js";

import { useStateGui } from "../../../../StateGui";
import { MapType } from "../../../../_entities/map.entity";
import { MapStore, userMaps } from "../../../../_stores/map.store";
import { MapsUtils } from "../../../../utils/maps.utils";
import { setCalendars } from "../../../content/calendar/calendar.manager";
import { setCalendarsPeriod } from "../../../content/calendar/template/Calendar";
import { setLines } from "../../../content/map/component/organism/BusLines";
import { setSchools } from "../../../content/map/component/organism/SchoolPoints";
import { setStops } from "../../../content/map/component/organism/StopPoints";
import { setTrips } from "../../../content/map/component/organism/Trips";
import { setSelectedMenu } from "../../menuItemFields";
import "./MapSelector.css";

export const [selectedMap, setSelectedMap] = createSignal<MapType | null>();
const [, { setActiveMapId }] = useStateGui();

export function MapSelector() {
  onMount(async () => {
    await MapStore.fetchUserMaps();
    setSelectedMap(MapsUtils.getSelectedMap(userMaps()));
  });

  createEffect(() => {
    setSelectedMap(MapsUtils.getSelectedMap(userMaps()));
    console.log(selectedMap());

    if (!selectedMap()) {
      setActiveMapId(null);
      setSchools([]);
      setStops([]);
      setCalendars([]);
      setCalendarsPeriod([]);
      setTrips([]);
      setLines([]);
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
