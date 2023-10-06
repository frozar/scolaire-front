import { createSignal } from "solid-js";
import { LineType } from "../../../../../_entities/line.entity";
import PlusIcon from "../../../../../icons/PlusIcon";
import { displayAddCourseMessage } from "../../../../../userInformation/utils";
import { getLines } from "../../../map/component/organism/BusLines";
import {
  deselectAllCourses,
  getCourses,
} from "../../../map/component/organism/Courses";
import { deselectAllPoints } from "../../../map/component/organism/Points";
import InputSearch from "../../../schools/component/molecule/InputSearch";
import BusLinesList from "../../../schools/component/organism/BusLinesList";
import ButtonIcon from "../molecule/ButtonIcon";
import { changeBoard, onBoard } from "../template/ContextManager";
import "./BusLines.css";

export const [currentBusLine, setCurrentBusLine] = createSignal<LineType>();
export default function () {
  const [searchKeyword, setSearchKeyword] = createSignal<string>("");

  // const filteredLines = () =>
  //   getLines().filter((line) => line.name?.includes(searchKeyword()));

  function addLine() {
    if (onBoard() == "line-add") {
      changeBoard("line");
    } else {
      deselectAllPoints();
      deselectAllCourses();
      // toggleDrawMod();

      // setCurrentStep(drawModeStep.schoolSelection);
      changeBoard("line-add");
      displayAddCourseMessage();
    }
  }

  function onInputSearch(key: string) {
    setSearchKeyword(key);
  }

  return (
    <section>
      <header class="line-board-header">
        <div class="line-board-header-infos">
          <p>Total des lignes: {getCourses().length}</p>
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
