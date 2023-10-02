import { createSignal } from "solid-js";
import PlusIcon from "../../../../../icons/PlusIcon";
import { displayAddLineMessage } from "../../../../../userInformation/utils";
import {
  deselectAllCourses,
  getCourses,
} from "../../../map/component/organism/Courses";
import { deselectAllPoints } from "../../../map/component/organism/Points";
import InputSearch from "../../../schools/component/molecule/InputSearch";
import LinesList from "../../../schools/component/organism/LinesList";
import ButtonIcon from "../molecule/ButtonIcon";
import { onBoard, toggleDrawMod } from "../template/ContextManager";
import { drawModeStep, setCurrentStep } from "./DrawModeBoardContent";
import "./LinesBoard.css";

export default function () {
  const [searchKeyword, setSearchKeyword] = createSignal<string>("");

  const filteredLines = () =>
    getCourses().filter((line) => line.name?.includes(searchKeyword()));

  function addLine() {
    if (onBoard() == "line-draw") {
      toggleDrawMod();
      setCurrentStep(drawModeStep.start);
    } else {
      deselectAllPoints();
      deselectAllCourses();
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
      <header class="line-board-header">
        <div class="line-board-header-infos">
          <p>Total des courses: {getCourses().length}</p>
          <ButtonIcon icon={<PlusIcon />} onClick={addLine} />
        </div>

        <InputSearch onInput={onInputSearch} />
      </header>

      <LinesList lines={filteredLines()} />
    </section>
  );
}
