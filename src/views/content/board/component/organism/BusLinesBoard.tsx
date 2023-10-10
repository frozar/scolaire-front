import { createSignal } from "solid-js";
import PlusIcon from "../../../../../icons/PlusIcon";
<<<<<<< HEAD:src/views/content/board/component/organism/BusLinesBoard.tsx
=======
>>>>>>> 4796db34 (refacto course management to race, and clean the StateAction (delete reference to courseUnderConstruction)):src/views/content/board/component/organism/LinesBoard.tsx
import { deselectAllPoints } from "../../../map/component/organism/Points";
import {
  deselectAllRaces,
  getRaces,
} from "../../../map/component/organism/Races";
import InputSearch from "../../../schools/component/molecule/InputSearch";
import ButtonIcon from "../molecule/ButtonIcon";
import { onBoard, toggleDrawMod } from "../template/ContextManager";
import { DrawModeStep, setCurrentStep } from "./DrawRaceBoard";
import "./LinesBoard.css";

export default function () {
  const [searchKeyword, setSearchKeyword] = createSignal<string>("");

  // TODO corriger
  // const filteredLines = () =>
  //   getRaces.filter((race) => race.name?.includes(searchKeyword()));

  function addLine() {
    if (onBoard() == "line-draw") {
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
