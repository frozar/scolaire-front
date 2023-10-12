import { createSignal } from "solid-js";
import PlusIcon from "../../../../../icons/PlusIcon";
import { displayAddRaceMessage } from "../../../../../userInformation/utils";
import { getLines } from "../../../map/component/organism/BusLines";
import { deselectAllPoints } from "../../../map/component/organism/Points";
import { deselectAllRaces } from "../../../map/component/organism/Races";
import InputSearch from "../../../schools/component/molecule/InputSearch";
import BusLinesList from "../../../schools/component/organism/BusLinesList";
import ButtonIcon from "../molecule/ButtonIcon";
import {
  changeBoard,
  onBoard,
  toggleDrawMod,
} from "../template/ContextManager";
import { AddLineStep, setAddLineCurrentStep } from "./AddLineBoardContent";
import "./BusLines.css";
import { DrawRaceStep, setCurrentStep } from "./DrawRaceBoard";

export default function () {
  const [searchKeyword, setSearchKeyword] = createSignal<string>("");

  // TODO corriger
  // const filteredLines = () =>
  //   getRaces.filter((race) => race.name?.includes(searchKeyword()));

  function addLine() {
    if (onBoard() == "line-add") {
      toggleDrawMod();
      setCurrentStep(DrawRaceStep.initial);
    } else {
      deselectAllPoints();
      deselectAllRaces();

      // TODO corriger
      // displayAddLineMessage();
      changeBoard("line-add");
      setAddLineCurrentStep(AddLineStep.schoolSelection);
      toggleDrawMod();
      displayAddRaceMessage();
    }
  }

  function onInputSearch(key: string) {
    setSearchKeyword(key);
  }

  return (
    <section>
      <header class="line-board-header">
        <div class="line-board-header-infos">
          <p>Total des courses: {getLines().length}</p>
          <ButtonIcon icon={<PlusIcon />} onClick={addLine} />
        </div>

        <InputSearch onInput={onInputSearch} />
      </header>

      <BusLinesList
        lines={
          getLines().filter((line) => line.name?.includes(searchKeyword()))
            .length == 0
            ? []
            : getLines().filter((line) => line.name?.includes(searchKeyword()))
        }
      />
    </section>
  );
}
