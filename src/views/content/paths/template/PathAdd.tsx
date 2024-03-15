import { createSignal, onCleanup, onMount } from "solid-js";
import { WayType } from "../../../../_entities/way.entity";
import { getSchools } from "../../../../_stores/school.store";
import { getStops } from "../../../../_stores/stop.store";
import { getWays } from "../../../../_stores/way.store";
import {
  setWayLineColor,
  setWaylineOpacity,
} from "../../_component/molecule/WayLine";
import { setDisplaySchools } from "../../_component/organisme/SchoolPoints";
import { setDisplayStops } from "../../_component/organisme/StopPoints";
import { setDisplayWays } from "../../_component/organisme/Ways";
import { COLOR_GRAY_BASE } from "../../map/constant";
import { WayList } from "../organism/WayList";
import { WayListButtons } from "../organism/WayListButtons";
import "./PathAdd.css";

export const [selectedWays, setSelectedWays] = createSignal<WayType[]>([]);

export function PathAdd() {
  onMount(() => {
    setDisplaySchools(getSchools());
    setDisplayStops(getStops());
    setDisplayWays(getWays());
    setWayLineColor(COLOR_GRAY_BASE);
    setWaylineOpacity(1);
  });

  onCleanup(() => {
    setDisplaySchools([]);
    setDisplayStops([]);
    setDisplayWays([]);
    setSelectedWays([]);
  });

  function removeWay(way: WayType) {
    const newList = selectedWays().filter((item) => item != way);
    setSelectedWays(newList);
  }

  return (
    <section>
      <div class="path-add-padding">
        <div class="path-add-content">
          <div class="path-add-title">Ajouter un chemin</div>
          <WayListButtons />
          <WayList ways={selectedWays()} deleteFunction={removeWay} />
        </div>
      </div>
    </section>
  );
}
