import { For, createSignal, onCleanup, onMount } from "solid-js";
import { getSchools } from "../../../../_stores/school.store";
import { getStops } from "../../../../_stores/stop.store";
import { getWays } from "../../../../_stores/way.store";
import Button from "../../../../component/atom/Button";
import { ViewManager } from "../../ViewManager";
import {
  setWayLineColor,
  setWaylineOpacity,
} from "../../_component/molecule/WayLine";
import { setDisplaySchools } from "../../_component/organisme/SchoolPoints";
import { setDisplayStops } from "../../_component/organisme/StopPoints";
import { setDisplayWays } from "../../_component/organisme/Ways";
import { COLOR_GRAY_BASE } from "../../map/constant";

export const [selectedPaths, setSelectedPaths] = createSignal<number[]>([]);

export function PathAdd() {
  onMount(() => {
    setDisplaySchools(getSchools());
    setDisplayStops(getStops());
    setDisplayWays(getWays());
    setWayLineColor(COLOR_GRAY_BASE);
    setWaylineOpacity(0.5);
  });

  onCleanup(() => {
    setDisplaySchools([]);
    setDisplayStops([]);
    setDisplayWays([]);
    setSelectedPaths([]);
  });

  return (
    <section>
      <div>Ajouter un chemin</div>
      <div>
        <Button label="Annuler" variant="danger" onClick={ViewManager.paths} />
        <Button label="Valider" onClick={() => console.log()} />
      </div>
      <div>
        <p>Chemins sélectionnés</p>
        <For each={selectedPaths()}>
          {(item) => {
            return <p>{item}</p>;
          }}
        </For>
      </div>
    </section>
  );
}
