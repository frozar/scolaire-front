import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { WayType } from "../../../../_entities/way.entity";
import { RoadService } from "../../../../_services/road.service";
import { getSchools } from "../../../../_stores/school.store";
import { getStops } from "../../../../_stores/stop.store";
import { getWays } from "../../../../_stores/way.store";
import {
  addNewGlobalSuccessInformation,
  addNewGlobalWarningInformation,
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../signaux";
import { ViewManager } from "../../ViewManager";
import {
  setWayLineColor,
  setWaylineOpacity,
} from "../../_component/molecule/WayLine";
import { setDisplaySchools } from "../../_component/organisme/SchoolPoints";
import { setDisplayStops } from "../../_component/organisme/StopPoints";
import { setDisplayWays } from "../../_component/organisme/Ways";
import { LabeledColorPicker } from "../../board/component/molecule/LabeledColorPicker";
import LabeledInputField from "../../board/component/molecule/LabeledInputField";
import { COLOR_GRAY_BASE } from "../../map/constant";
import { WayList } from "../organism/WayList";
import { WayListButtons } from "../organism/WayListButtons";
import "./PathAdd.css";

export const [selectedWays, setSelectedWays] = createSignal<WayType[]>([]);

export function PathAdd() {
  const [canSave, setCanSave] = createSignal(false);
  const [roadName, setRoadName] = createSignal("");
  const [roadColor, setRoadColor] = createSignal("#ffffff");

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
    setRoadName("");
    setRoadColor("#ffffff");
  });

  function removeWay(way: WayType) {
    const newList = selectedWays().filter((item) => item != way);
    setSelectedWays(newList);
  }

  async function submitPath() {
    if (roadName() == "")
      return addNewGlobalWarningInformation("Veuillez choisir un nom");
    enableSpinningWheel();
    await RoadService.create({
      color: roadColor(),
      name: roadName(),
      ways: selectedWays().map((way) => {
        return { name: way.name, osm_id: way.id };
      }),
    });
    addNewGlobalSuccessInformation("Création de chemin");
    disableSpinningWheel();
    ViewManager.paths();
  }

  createEffect(() => {
    if (selectedWays().length > 0) {
      setCanSave(true);
    } else {
      setCanSave(false);
    }
  });

  return (
    <section>
      <div class="path-add-padding">
        <div class="path-add-content">
          <div class="path-add-title">Ajouter un chemin</div>
          <LabeledInputField
            label="Nom du chemin"
            name="path-name"
            value={roadName()}
            onInput={(e) => setRoadName(e.target.value)}
          />
          <LabeledColorPicker
            onChange={(e) => setRoadColor(e)}
            defaultColor={roadColor()}
            text="Couleur"
          />
          <WayList
            canDelete={true}
            ways={selectedWays()}
            deleteFunction={removeWay}
          />
          <WayListButtons canSave={canSave()} submit={submitPath} />
        </div>
      </div>
    </section>
  );
}
