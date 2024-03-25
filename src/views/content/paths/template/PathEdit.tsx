import { createSignal, onCleanup, onMount } from "solid-js";
import { RoadType } from "../../../../_entities/road.entity";
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
import { mapBoard } from "../../_component/template/MapBoardManager";
import { LabeledColorPicker } from "../../board/component/molecule/LabeledColorPicker";
import LabeledInputField from "../../board/component/molecule/LabeledInputField";
import { COLOR_GRAY_BASE } from "../../map/constant";
import { WayList } from "../organism/WayList";
import { WayListButtons } from "../organism/WayListButtons";
import "./Paths.css";

export const [editRoad, setEditRoad] = createSignal<RoadType>({} as RoadType);
export const [editways, setEditWays] = createSignal<WayType[]>([]);

export function PathEdit() {
  const [roadName, setRoadName] = createSignal("");
  const [roadColor, setRoadColor] = createSignal("");

  //   async function editPath() {
  //     if (roadName() == "")
  //       return addNewGlobalWarningInformation("Veuillez choisir un nom");
  //     enableSpinningWheel();
  //     await RoadService.update({
  //       id: editRoad().id,
  //       color: roadColor(),
  //       name: roadName(),
  //       ways: editways().map((way) => {
  //         return { name: way.name, osm_id: way.id };
  //       }),
  //     });
  //     addNewGlobalSuccessInformation("Création de chemin");
  //     disableSpinningWheel();
  //     ViewManager.paths();
  //   }

  onMount(() => {
    setDisplaySchools(getSchools());
    setDisplayStops(getStops());
    setDisplayWays(getWays());
    setWayLineColor(COLOR_GRAY_BASE);
    setWaylineOpacity(1);
    setRoadName(editRoad().name);
    setRoadColor(editRoad().color);
    console.log(mapBoard());
    console.log(roadColor());
  });

  onCleanup(() => {
    setDisplaySchools([]);
    setDisplayStops([]);
    setDisplayWays([]);
    setRoadName("");
    setRoadColor("");
  });

  return (
    <div>
      <div class="path-padding">
        <div class="path-content">
          <div class="path-title">Editer un chemin</div>
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
            ways={[]}
            deleteFunction={() => console.log()}
          />
          <WayListButtons canSave={false} submit={() => console.log()} />
        </div>
      </div>
    </div>
  );
}
