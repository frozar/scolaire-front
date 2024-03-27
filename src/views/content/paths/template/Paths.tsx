import { createSignal, onCleanup, onMount } from "solid-js";
import { RoadType } from "../../../../_entities/road.entity";
import { WayType } from "../../../../_entities/way.entity";
import { WayService } from "../../../../_services/ways.service";
import { WayStore, getWays } from "../../../../_stores/way.store";
import Button from "../../../../component/atom/Button";
import { disableSpinningWheel, enableSpinningWheel } from "../../../../signaux";
import { ViewManager } from "../../ViewManager";
import { setDisplaySchools } from "../../_component/organisme/SchoolPoints";
import { setDisplayStops } from "../../_component/organisme/StopPoints";
import { displayWays, setDisplayWays } from "../../_component/organisme/Ways";
import { RoadList } from "../organism/RoadList";
import "./Paths.css";

export const [getRoads, setRoads] = createSignal<RoadType[]>([]);

export function Paths() {
  onMount(async () => {
    await loadWays();
    // setDisplaySchools(getSchools());
    // setDisplayStops(getStops());
    setRoadWays();
  });

  onCleanup(() => {
    setDisplaySchools([]);
    setDisplayStops([]);
    unsetRoadWays();
    setDisplayWays([]);
  });

  function setRoadWays() {
    const osmIdList: number[] = [];
    const wayColorList: { id: number; color: string }[] = [];
    getRoads().forEach((road) => {
      road.ways.forEach((way) => {
        osmIdList.push(way.osm_id);
        wayColorList.push({ id: way.osm_id, color: road.color });
      });
    });

    const roadWays = getWays().filter((item) => osmIdList.includes(item.id));
    // const output = roadWays.map((item) => {
    //   wayColorList.forEach((obj) => {
    //     if (item.id == obj.id) {
    //       item.color = obj.color;
    //     }
    //   });
    //   return item;
    // });
    setDisplayWays([]);
    setDisplayWays(roadWays);
  }

  function unsetRoadWays() {
    const a = displayWays().map((item) => {
      return { ...item, color: undefined };
    });
    setDisplayWays([]);
    setDisplayWays(a);
  }

  return (
    <section>
      <div class="paths-padding">
        <div class="paths-content">
          <div class="paths-title">Routes</div>
          <Button label="Ajouter" onClick={() => ViewManager.pathAdd()} />
          <RoadList roads={getRoads()} />
        </div>
      </div>
    </section>
  );
}

export async function loadWays() {
  if (getWays().length == 0) {
    enableSpinningWheel();
    const ways = await WayService.getAll();
    WayStore.set(ways as WayType[]);
    disableSpinningWheel();
  }
}
