import L from "leaflet";
import { For, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import { getSchools } from "../../../../../_stores/school.store";
import Button from "../../../../../component/atom/Button";
import { ViewManager } from "../../../ViewManager";
import { setDisplaySchools } from "../../../_component/organisme/SchoolPoints";
import { leafletMap } from "../../../_component/template/MapContainer";
import InputSearch from "../molecule/InputSearch";
import SchoolItem from "../molecule/SchoolItem";
import "./Schools.css";

export default function () {
  const [keywordSearch, setKeyWordSearch] = createSignal<string>("");
  const [localSchools, setLocalSchools] = createSignal<SchoolType[]>([]);

  onMount(() => {
    setDisplaySchools(getSchools());
    setLocalSchools(getSchools());
    const locations: L.LatLng[] = [];
    getSchools().forEach((stop) => {
      const latlong = L.latLng(stop.lat, stop.lon);
      locations.push(latlong);
    });
    const polygon = L.polygon(locations);
    leafletMap()?.fitBounds(polygon.getBounds(), { maxZoom: 13 });
  });
  onCleanup(() => {
    setDisplaySchools([]);
  });

  createEffect(() => {
    if (keywordSearch().length != 0) {
      setLocalSchools(filterSchools(keywordSearch()));
    } else {
      setLocalSchools(getSchools());
    }
  });

  return (
    <section>
      <header>
        <InputSearch
          onInput={(key: string) => {
            setKeyWordSearch(key);
          }}
        />
        <div class="py-4">
          <Button
            label="Ajouter une école"
            onClick={() => ViewManager.schoolAdd()}
          />
        </div>
        <div class="school-board-number">
          <p>
            {localSchools().length + " "}
            {localSchools().length > 1 ? "Établissements" : "Établissement"}
          </p>
        </div>
      </header>
      <div class="school-board-content">
        <For each={localSchools()}>
          {(fields) => <SchoolItem school={fields} />}
        </For>
      </div>
    </section>
  );
}

const filterSchools = (filter: string) =>
  getSchools().filter((school) =>
    school.name.toLowerCase().includes(filter.toLowerCase())
  );
