import { createSignal, onCleanup, onMount } from "solid-js";
import { RoadType } from "../../../../_entities/road.entity";
import { WayType } from "../../../../_entities/way.entity";
import { RoadService } from "../../../../_services/road.service";
import { getWays } from "../../../../_stores/way.store";
import { CircleCrossIcon } from "../../../../icons/CircleCrossIcon";
import TrashIcon from "../../../../icons/TrashIcon";
import {
  addNewGlobalSuccessInformation,
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../signaux";
import { ViewManager } from "../../ViewManager";
import { setWayLineColor } from "../../_component/molecule/WayLine";
import { setDisplayWays } from "../../_component/organisme/Ways";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { WayList } from "../organism/WayList";
import "./PathDetails.css";
import "./Paths.css";

export const [selectedRoad, setSelectedRoad] = createSignal<RoadType>(
  {} as RoadType
);

export function PathDetails() {
  const [currentWays, setCurrentWays] = createSignal<WayType[]>([]);

  function setroadways() {
    const osmIdList: number[] = [];
    selectedRoad().ways.forEach((item) => {
      osmIdList.push(item.osm_id);
    });
    setCurrentWays(getWays().filter((item) => osmIdList.includes(item.id)));
    setDisplayWays(currentWays());
  }

  async function deleteRoad() {
    enableSpinningWheel();
    await RoadService.deleteRoad(selectedRoad().id);
    addNewGlobalSuccessInformation("Chemin supprimé");
    disableSpinningWheel();
    ViewManager.paths();
  }

  onMount(() => {
    setroadways();
    setWayLineColor(selectedRoad().color);
  });

  onCleanup(() => {
    setSelectedRoad({} as RoadType);
    setDisplayWays([]);
  });

  return (
    <div>
      <div class="paths-padding">
        <div class="paths-content">
          <div class="paths-title">{selectedRoad().name}</div>
          <div class="path-details-top-buttons">
            <ButtonIcon
              icon={<CircleCrossIcon />}
              onClick={() => ViewManager.paths()}
            />
            <ButtonIcon icon={<TrashIcon />} onClick={deleteRoad} />
          </div>
          <WayList
            canDelete={false}
            deleteFunction={() => console.log()}
            ways={currentWays()}
          />
        </div>
      </div>
    </div>
  );
}
