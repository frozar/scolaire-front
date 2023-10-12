import { createSignal } from "solid-js";
import PlusIcon from "../../../../../icons/PlusIcon";
import { displayAddRaceMessage } from "../../../../../userInformation/utils";
import { deselectAllPoints } from "../../../map/component/organism/Points";
import {
  deselectAllRaces,
  getRaces,
} from "../../../map/component/organism/Races";
import InputSearch from "../../../schools/component/molecule/InputSearch";
import { RacesList } from "../../../schools/component/organism/RacesList";
import ButtonIcon from "../molecule/ButtonIcon";
import { onBoard, toggleDrawMod } from "../template/ContextManager";
import { DrawModeStep, setCurrentStep } from "./DrawRaceBoard";
import "./RacesBoard.css";

export function RacesBoard() {
  const [searchKeyword, setSearchKeyword] = createSignal<string>("");

  const filteredRaces = () =>
    getRaces.filter((line) => line.name?.includes(searchKeyword()));

  function addRace() {
    if (onBoard() == "race-draw") {
      toggleDrawMod();
      setCurrentStep(DrawModeStep.start);
    } else {
      deselectAllPoints();
      deselectAllRaces();
      toggleDrawMod();

      setCurrentStep(DrawModeStep.schoolSelection);
      displayAddRaceMessage();
    }
  }

  function onInputSearch(key: string) {
    setSearchKeyword(key);
  }

  return (
    <section>
      <header class="races-board-header">
        <div class="races-board-header-infos">
          <p>Total des courses: {getRaces.length}</p>
          <ButtonIcon icon={<PlusIcon />} onClick={addRace} />
        </div>

        <InputSearch onInput={onInputSearch} />
      </header>

      <RacesList races={filteredRaces()} />
    </section>
  );
}
