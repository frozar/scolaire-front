import L from "leaflet";
import { For, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import { StopType } from "../../../../../_entities/stop.entity";
import { getSchools } from "../../../../../_stores/school.store";
import { getStops } from "../../../../../_stores/stop.store";
import Button from "../../../../../component/atom/Button";
import { ViewManager } from "../../../ViewManager";
import { setDisplaySchools } from "../../../_component/organisme/SchoolPoints";
import { setDisplayStops } from "../../../_component/organisme/StopPoints";
import { leafletMap } from "../../../_component/template/MapContainer";
import InputSearch from "../../../schools/component/molecule/InputSearch";
import StopItem from "../molecul/StopItem";
import "./Stops.css";

export function Stops() {
  const [keywordSearch, setKeyWordSearch] = createSignal<string>("");
  const [localStops, setLocalStops] = createSignal<StopType[]>([]);

  onMount(() => {
    setMapData(getStops(), getSchools());
    setLocalStops(getStops());
    const locations: L.LatLng[] = [];
    getStops().forEach((stop) => {
      const latlong = L.latLng(stop.lat, stop.lon);
      locations.push(latlong);
    });
    const polygon = L.polygon(locations);
    leafletMap()?.fitBounds(polygon.getBounds(), { maxZoom: 14 });
  });
  onCleanup(() => {
    setMapData([], []);
  });

  createEffect(() => {
    setMapData(getStops(), getSchools());
    setLocalStops(getStops());
  });

  createEffect(() => {
    if (keywordSearch().length != 0) {
      setLocalStops(filterStops(keywordSearch()));
    } else {
      setLocalStops(getStops());
    }
  });

  return (
    <section class="stop-board">
      <header>
        <InputSearch onInput={setKeyWordSearch} />
        <div class="stop-board-number">
          <p>
            {localStops().length + " "}
            {localStops().length > 1 ? "Arrêts" : "Arrêt"}
          </p>
        </div>
      </header>
      <div class="py-4">
        <Button
          label="Ajouter un arrêt"
          onClick={() => ViewManager.stopAdd()}
        />
      </div>
      <div class="stop-board-content">
        <For each={localStops()}>{(fields) => <StopItem stop={fields} />}</For>
      </div>
    </section>
  );
}

function setMapData(stops: StopType[], schools: SchoolType[]) {
  setDisplayStops(stops);
  setDisplaySchools(schools);
}

const filterStops = (filter: string) =>
  getStops().filter((stop) =>
    stop.name.toLowerCase().includes(filter.toLowerCase())
  );
