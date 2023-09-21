import { createSignal } from "solid-js";
import PlusIcon from "../../../../../icons/PlusIcon";
import { displayAddLineMessage } from "../../../../../userInformation/utils";
import {
  deselectAllBusLines,
  getBusLines,
} from "../../../map/component/organism/BusLines";
import { deselectAllPoints } from "../../../map/component/organism/Points";
import InputSearch from "../../../schools/component/molecule/InputSearch";
import LinesList from "../../../schools/component/organism/LinesList";
import ButtonIcon from "../molecule/ButtonIcon";
import { onBoard, toggleDrawMod } from "../template/ContextManager";
import { drawModeStep, setCurrentStep } from "./DrawModeBoardContent";

export default function () {
  const [searchKeyword, setSearchKeyword] = createSignal<string>("");

  const filteredLines = () =>
    getBusLines().filter((line) => line.name?.includes(searchKeyword()));

  function addLine() {
    if (onBoard() == "line-draw") {
      toggleDrawMod();
      setCurrentStep(drawModeStep.start);
    } else {
      deselectAllPoints();
      deselectAllBusLines();
      toggleDrawMod();

      setCurrentStep(drawModeStep.schoolSelection);
      displayAddLineMessage();
    }
  }

  function onInputSearch(key: string) {
    setSearchKeyword(key);
  }

  return (
    <section>
      <header class="my-5">
        <div class="flex justify-between my-3">
          <p>Total des lignes: {getBusLines().length}</p>
          <ButtonIcon icon={<PlusIcon />} onClick={addLine} />
        </div>

        <InputSearch onInput={onInputSearch} />
      </header>

      <LinesList lines={filteredLines()} />
    </section>
  );
}
