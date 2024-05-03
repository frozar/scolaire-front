import { For, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { PathType } from "../../../../_entities/road.entity";
import { WayType } from "../../../../_entities/way.entity";
import { WayService } from "../../../../_services/ways.service";
import { getPaths } from "../../../../_stores/path.store";
import { getSchools } from "../../../../_stores/school.store";
import { getStops } from "../../../../_stores/stop.store";
import { WayStore, getWays } from "../../../../_stores/way.store";
import Button from "../../../../component/atom/Button";
import { disableSpinningWheel, enableSpinningWheel } from "../../../../signaux";
import { ViewManager } from "../../ViewManager";
import { setDisplaySchools } from "../../_component/organisme/SchoolPoints";
import { setDisplayStops } from "../../_component/organisme/StopPoints";
import { setDisplayWays } from "../../_component/organisme/Ways";
import InputSearch from "../../schools/component/molecule/InputSearch";
import { RoadListItem } from "../molecule/RoadListItem";
import "./Paths.css";

export function Paths() {
  const [keywordSearch, setKeyWordSearch] = createSignal<string>("");
  const [filteredPaths, setFilteredRoads] = createSignal<PathType[]>([]);

  onMount(async () => {
    setFilteredRoads(getPaths());
    await loadWays();
    setDisplaySchools(getSchools());
    setDisplayStops(getStops());
    setRoadWays();
  });

  onCleanup(() => {
    setDisplaySchools([]);
    setDisplayStops([]);
    setDisplayWays([]);
  });

  createEffect(() => {
    if (keywordSearch().length != 0) {
      setFilteredRoads(filterPaths(keywordSearch()));
    } else {
      setFilteredRoads(getPaths());
    }
  });

  function setRoadWays() {
    const osmIdList: number[] = [];
    const wayColorList: { id: number; color: string }[] = [];
    filteredPaths().forEach((road) => {
      road.ways.forEach((way) => {
        osmIdList.push(way.osm_id);
        wayColorList.push({ id: way.osm_id, color: road.color });
      });
    });

    const roadWays = getWays().filter((item) => osmIdList.includes(item.id));
    const output = roadWays.map((item) => {
      wayColorList.forEach((obj) => {
        if (item.id == obj.id) {
          item.color = obj.color;
        }
      });
      return item;
    });
    setDisplayWays(output);
  }

  return (
    <>
      <InputSearch
        onInput={(key: string) => {
          setKeyWordSearch(key);
        }}
      />
      <Button label="Ajouter un chemin" onClick={() => ViewManager.pathAdd()} />
      <p class="paths-number-of">
        {filteredPaths().length + " chemin"}
        {filteredPaths().length > 1 ? "s" : ""}
      </p>
      <section class="paths-list">
        <For each={filteredPaths()}>
          {(path) => {
            return <RoadListItem road={path} />;
          }}
        </For>
      </section>
    </>
  );
}

const filterPaths = (filter: string) =>
  getPaths().filter((path) =>
    path.name.toLowerCase().includes(filter.toLowerCase())
  );

export async function loadWays() {
  if (getWays().length == 0) {
    enableSpinningWheel();
    const ways = await WayService.getAll();
    WayStore.set(ways as WayType[]);
    disableSpinningWheel();
  }
}
