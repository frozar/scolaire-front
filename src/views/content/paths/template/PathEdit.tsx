import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { RoadType } from "../../../../_entities/road.entity";
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
import { WayListButtons } from "../molecule/WayListButtons";
import { WayList } from "../organism/WayList";
import "./Paths.css";

export const [editRoad, setEditRoad] = createSignal<RoadType>({} as RoadType);
export const [editways, setEditWays] = createSignal<WayType[]>([]);

export function PathEdit() {
  const [canSubmit, setCanSubmit] = createSignal(false);
  const [roadName, setRoadName] = createSignal("");
  const [roadColor, setRoadColor] = createSignal("");

  function setCurrentWays() {
    const osmIds: number[] = [];
    editRoad().ways.forEach((way) => {
      osmIds.push(way.osm_id);
    });
    setEditWays(getWays().filter((way) => osmIds.includes(way.id)));
  }

  function removeWay(way: WayType) {
    const newList = editways().filter((item) => item != way);
    setEditWays(newList);
  }

  async function editPath() {
    if (roadName() == "")
      return addNewGlobalWarningInformation("Veuillez choisir un nom");
    enableSpinningWheel();
    await RoadService.update({
      id: editRoad().id,
      color: roadColor(),
      name: roadName(),
      ways: editways().map((way) => {
        return { name: way.name, osm_id: way.id };
      }),
    });
    addNewGlobalSuccessInformation("Edit path");
    disableSpinningWheel();
    ViewManager.paths();
  }

  onMount(() => {
    setCurrentWays();
    setDisplaySchools(getSchools());
    setRoadName(editRoad().name);
    setRoadColor(editRoad().color);
    setDisplayStops(getStops());
    setDisplayWays(getWays());
    setWayLineColor(COLOR_GRAY_BASE);
    setWaylineOpacity(1);
  });

  onCleanup(() => {
    setDisplaySchools([]);
    setDisplayStops([]);
    setDisplayWays([]);
    setRoadName("");
    setRoadColor("");
    setEditRoad({} as RoadType);
    setEditWays([]);
  });

  createEffect(() => {
    if (editways().length > 0) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  });

  return (
    <div>
      <div class="paths-padding">
        <div class="paths-content">
          <div class="paths-title">Editer une route</div>
          <LabeledInputField
            label="Nom du chemin"
            name="path-name"
            value={roadName()}
            onInput={(e) => setRoadName(e.target.value)}
          />
          <LabeledColorPicker
            onChange={(e) => setRoadColor(e)}
            defaultColor={editRoad().color}
            text="Couleur"
          />
          <WayList
            canDelete={true}
            ways={editways()}
            deleteFunction={removeWay}
          />
          <WayListButtons
            cancel={() => ViewManager.pathDetails(editRoad())}
            canSave={canSubmit()}
            submit={editPath}
          />
        </div>
      </div>
    </div>
  );
}
