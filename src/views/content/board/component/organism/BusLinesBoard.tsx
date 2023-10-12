import { createSignal } from "solid-js";
import PlusIcon from "../../../../../icons/PlusIcon";
import { deselectAllPoints } from "../../../map/component/organism/Points";
import {
  deselectAllRaces,
  getRaces,
} from "../../../map/component/organism/Races";
import InputSearch from "../../../schools/component/molecule/InputSearch";
import ButtonIcon from "../molecule/ButtonIcon";
import { onBoard, toggleDrawMod } from "../template/ContextManager";
import "./BusLines.css";
import { DrawModeStep, setCurrentStep } from "./DrawRaceBoard";

export default function () {
  const [searchKeyword, setSearchKeyword] = createSignal<string>("");

  // TODO corriger
  // const filteredLines = () =>
  //   getRaces.filter((race) => race.name?.includes(searchKeyword()));

  function addLine() {
    if (onBoard() == "race-draw") {
      toggleDrawMod();
      setCurrentStep(DrawModeStep.start);
    } else {
      deselectAllPoints();
      deselectAllRaces();
      toggleDrawMod();

      setCurrentStep(DrawModeStep.schoolSelection);
      // TODO corriger
      // displayAddLineMessage();
    }
  }

  function onInputSearch(key: string) {
    setSearchKeyword(key);
  }

  return (
    <section>
      <header class="line-board-header">
        <div class="line-board-header-infos">
          <p>Total des courses: {getRaces.length}</p>
          <ButtonIcon icon={<PlusIcon />} onClick={addLine} />
        </div>

        <InputSearch onInput={onInputSearch} />
      </header>

      {/* TODO à corriger */}
      {/* <LinesList lines={filteredLines()} /> */}
    </section>
  );
}
