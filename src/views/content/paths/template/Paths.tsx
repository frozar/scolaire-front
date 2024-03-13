import { onCleanup, onMount } from "solid-js";
import { WayType } from "../../../../_entities/way.entity";
import { WayService } from "../../../../_services/ways.service";
import { getSchools } from "../../../../_stores/school.store";
import { getStops } from "../../../../_stores/stop.store";
import { WayStore, getWays } from "../../../../_stores/way.store";
import Button from "../../../../component/atom/Button";
import { disableSpinningWheel, enableSpinningWheel } from "../../../../signaux";
import { ViewManager } from "../../ViewManager";
import { setDisplaySchools } from "../../_component/organisme/SchoolPoints";
import { setDisplayStops } from "../../_component/organisme/StopPoints";

export function Paths() {
  onMount(async () => {
    await loadWays();
    setDisplaySchools(getSchools());
    setDisplayStops(getStops());
  });

  onCleanup(() => {
    setDisplaySchools([]);
    setDisplayStops([]);
  });

  function addPath() {
    ViewManager.pathAdd();
  }

  return (
    <div>
      <Button label="Ajouter" onClick={addPath} />
    </div>
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
