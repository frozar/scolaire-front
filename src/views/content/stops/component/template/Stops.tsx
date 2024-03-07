import { For, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import { StopType } from "../../../../../_entities/stop.entity";
import { getSchools } from "../../../../../_stores/school.store";
import { getStops } from "../../../../../_stores/stop.store";
import { setDisplaySchool } from "../../../_component/organisme/SchoolPoints";
import { setDisplayStops } from "../../../_component/organisme/StopPoints";
import InputSearch from "../../../schools/component/molecule/InputSearch";
import StopItem from "../molecul/StopItem";
import "./Stops.css";

export function Stops() {
  const [keywordSearch, setKeyWordSearch] = createSignal<string>("");
  const [localStops, setLocalStops] = createSignal<StopType[]>([]);

  onMount(() => {
    setMapData(getStops(), getSchools());
    setLocalStops(getStops());
  });
  onCleanup(() => {
    setMapData([], []);
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
          <p>{localStops().length + " "} Arrêts</p>
        </div>
      </header>

      <div class="stop-board-content">
        <For each={localStops()}>{(fields) => <StopItem stop={fields} />}</For>
      </div>
    </section>
  );
}

function setMapData(stops: StopType[], schools: SchoolType[]) {
  setDisplayStops(stops);
  setDisplaySchool(schools);
}

const filterStops = (filter: string) =>
  getStops().filter((stop) =>
    stop.name.toLowerCase().includes(filter.toLowerCase())
  );
